<template>
  <span class="d-flex">
    <v-combobox
      background-color="secondary"
      style="flex-grow: 999"
      :outlined="outlined"
      :solo="!outlined"
      multiple
      attach
      flat
      hide-selected
      append-icon=""
      ref="combobox"
      v-model="model"
      :filter="filter"
      :hide-no-data="!search"
      :items="items"
      :search-input.sync="search"
      :label="label"
      :loading="tagsLoading ? 'accent' : false"
      hide-details
      class="combobox-with-background"
      @keydown.enter="onEnterPressed"
    >
    <template v-if="searchFilters" #prepend-item>
      <SearchFilters :tags="tags" @add-tag="addTag($event)" @remove-tag="$emit('remove-tag', $event)" />
    </template>
      <template slot="no-data">
        <v-list-item>
          <span class="subheading">
            <kbd class="primary">Enter</kbd> to add
          </span>
          <v-chip color="blue-grey lighten-2" label small>
            {{ searchAsTag }}
          </v-chip>
        </v-list-item>
      </template>
      <template #selection="{ item, parent, selected, attrs }">
        <tag-label
          v-if="item === Object(item)"
          v-bind="attrs"
          :tag="item"
          close
          close-icon="mdi-delete"
          @click="parent.selectItem(item)"
          @click:close="parent.selectItem(item)"
          :input-value="selected"
        />
      </template>
      <template #item="{ item, attrs, on }">
        <v-list-item v-bind="attrs" v-on="on">
          <v-list-item-content class="d-flex">
            <span>
              <span v-if="item.text.startsWith('-')">Exclude</span>
              <tag-label :tag="item" />
            </span>
          </v-list-item-content>
          <v-list-item-action
            v-if="isFinite(item.post_count)"
            class="grey--text text-caption mr-2"
          >
            {{ item.post_count }} posts
          </v-list-item-action>
          <v-list-item-action class="ma-0">
            <tag-favorite-button
              :category="item.category"
              :name="item.text"
              :display-text="item.name"
            />
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-combobox>
  </span>
</template>

<script lang="ts">
import TagLabel from "./TagLabel.vue";
import { debounce, differenceBy } from "lodash";
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import { getApiService } from "@/worker/services";
import { categoryIdToCategoryName } from "@/misc/util/utilities";
import TagFavoriteButton from "./TagFavoriteButton.vue";
import { useFavoritesStore } from "@/services/FavoriteStore";
import { usePostsStore, useShortcutService, useUrlStore } from "@/services";
import { ITag } from "./ITag";
import SearchFilters from "./SearchFilters.vue";

interface ITagWithText extends ITag {
  text: string;
}

type ListItem = ITagWithText | { header: string };

const replacements: Record<string, string | undefined> = {
  "rating:e": "rating:explicit",
  "rating:q": "rating:questionable",
  "rating:s": "rating:safe",
};

export default defineComponent({
  props: {
    label: {
      type: String,
    },
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    searchFilters: {
      type: Boolean,
      default: true,
    }
  },
  components: {
    TagLabel,
    TagFavoriteButton,
    SearchFilters
},
  setup(props, context) {
    const urlStore = useUrlStore();
    const shortcutService = useShortcutService();
    const posts = usePostsStore();
    const favoritesStore = useFavoritesStore();
    const search = ref("");
    const tagsLoading = ref(false);
    const tags = ref<ITagWithText[]>([]);
    const searchAsTag = computed(() =>
      (search.value || "").replace(/\s/g, "_"),
    );
    const inverted = computed(() => searchAsTag.value.startsWith("-"));
    const stripSymbols = (str?: string) => (str || "").replace(/\W+/g, "");

    const addTag = (tag: string) => 
      context.emit("add-tag", replacements[tag] || tag);

    const filter = (item: ListItem, queryText: string, itemText: string) => {
      if ("header" in item) return false;
      const text = stripSymbols(itemText);
      const query = stripSymbols(queryText);
      const display = stripSymbols(item.name);
      return (
        `${text}\n${display}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    };
    const favorites = computed(() => {
      const result: ITagWithText[] = [];
      for (const [category, tags] of Object.entries(favoritesStore.tags)) {
        for (const [tag, display] of Object.entries(tags)) {
          result.push({
            category,
            name: typeof display === "string" ? display : tag,
            text: tag,
            post_count: Infinity, // should show first
          });
        }
      }
      return result;
    });
    const items = computed(() => {
      const list = [...favorites.value, ...tags.value];
      const tagsValue = inverted.value
        ? list.map((t) => ({ ...t, text: `-${t.text}` }))
        : list;
      const arr: ListItem[] = [
        {
          header: "Press enter to confirm, or start typing to search",
        },
        ...tagsValue,
      ];
      return arr;
    });
    const fetchTags = debounce(
      async (search: string) => {
        tagsLoading.value = true;
        const service = await getApiService();
        const result = await Promise.all([
          // TODO: error handling
          service.getTags({
            limit: posts.tagFetchLimit,
            order: "count",
            query: `*${search}*`,
            baseUrl: urlStore.e621Url,
          }),
          service.getPools({
            limit: posts.tagFetchLimit,
            order: "count",
            query: `*${search}*`,
            baseUrl: urlStore.e621Url,
          }),
        ]);

        tags.value = [
          ...result[0].map(
            (t) =>
              ({
                text: t.name,
                name: t.name,
                post_count: t.post_count,
                category: categoryIdToCategoryName(t.category),
              } as ITagWithText),
          ),
          ...result[1].map(
            (p) =>
              ({
                text: `pool:${p.id}`,
                category: "pool",
                post_count: p.post_count,
                name: p.name,
              } as ITagWithText),
          ),
        ];
        tagsLoading.value = false;
      },
      500,
      { trailing: true, maxWait: 3000 },
    );

    watch(
      () => search.value,
      (cur, prev) => {
        if (searchAsTag.value) fetchTags(searchAsTag.value.replace(/^\-/, ""));
      },
    );

    const model = computed<ITagWithText[]>({
      get() {
        return props.tags.map<ITagWithText>((str) => {
          {
            return {
              text: str,
              name: str,
              // TODO: find right category + post_count
              category: "general",
              post_count: 0,
            };
          }
        });
      },
      set(val) {
        search.value = "";
        const newItem = val.find((v) => typeof v === "string");
        if (newItem) {
          addTag(newItem as any);
        }
        const removedItems = differenceBy(
          props.tags,
          val.map((v) => v.text).filter((v) => v),
        );
        if (removedItems.length) {
          for (const item of removedItems) {
            context.emit("remove-tag", item);
          }
        }
        const addedItems = differenceBy(
          val.map((v) => v.text).filter((v) => v),
          props.tags,
        );
        if (addedItems.length) {
          for (const item of addedItems) {
            addTag(item);
          }
        }
      },
    });

    onBeforeUnmount(() => {
      shortcutService.emitter.off("focusSearch", focusSearch);
    });
    onMounted(() => {
      shortcutService.emitter.on("focusSearch", focusSearch);
    });
    const focusSearch = () => {
      combobox.value.focus();
    };

    const combobox = ref<any>();

    const onEnterPressed = () => {
      if (!search.value) {
        combobox.value.blur();
        context.emit("confirm-search");
      }
    };

    return {
      combobox,
      search,
      searchAsTag,
      filter,
      items,
      tagsLoading,
      model,
      onEnterPressed,
      inverted,
      addTag,
    };
  },
});
</script>

<style scoped>
.combobox-with-background :deep(.v-list) {
  background-color: var(--v-secondary-base);
}
</style>
