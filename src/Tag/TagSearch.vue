<template>
  <span class="d-flex">
    <v-combobox item-title="name" item-value="text" bg-color="secondary" style="flex-grow: 999"
      :variant="outlined ? 'outlined' : 'solo'" multiple flat hide-selected ref="combobox" v-model="model"
      :custom-filter="filter" :items="items" v-model:search="search" :label="label" autocomplete="off"
      :loading="tagsLoading ? 'accent' : false" hide-details @keydown.enter="onEnterPressed">
      <template #prepend-item>
        <SearchFilters v-if="props.searchFilters && !search" :tags="props.tags" @add-tag="addTag($event)" @remove-tag="$emit('remove-tag', $event)" />
        <div class="mx-4" v-if="!search">
          Press enter to confirm, or start typing to search
        </div>
        <div class="mx-4" v-else>
          Press enter to add <v-chip color="blue-grey-lighten-2" label size="small">
            {{ searchAsTag }}
            </v-chip>
        </div>
      </template>
      <template #selection="{ item, index }">
        <tag-label v-if="item === Object(item)" :tag="item.raw" closable :input-value="true" @click:close="$emit('remove-tag', item.raw.text)" />
      </template>
      <template #item="{ item, props }">
        <v-list-item v-bind="{ ...props, title: undefined }" v-if="item.raw.text">
          <v-list-item-title>
            <span v-if="item.raw.text.startsWith('-')">Exclude</span>
            <tag-label :tag="item.raw" />
          </v-list-item-title>
          <template #append>
            <div v-if="item.raw.post_count && isFinite(item.raw.post_count)" class="text-grey text-caption mr-2">
              {{ item.raw.post_count }} posts
            </div>
            <tag-favorite-button v-if="item.raw.category" :category="item.raw.category" :name="item.raw.text"
              :display-text="item.raw.name" />
          </template>
        </v-list-item>
        <v-list-item v-else v-bind="props">
          <span class="subheading">
            <kbd class="bg-primary">Enter</kbd> to add
          </span>
          <v-chip color="blue-grey-lighten-2" label size="small">
            {{ searchAsTag }}
          </v-chip>
        </v-list-item>
      </template>
    </v-combobox>
  </span>
</template>

<script setup lang="ts">
import TagLabel from "./TagLabel.vue";
import { debounce, differenceBy, sortBy, uniqBy } from "lodash";
import type { PropType } from "vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, } from "vue";
import { getApiService } from "@/worker/services";
import { categoryIdToCategoryName } from "@/misc/util/utilities";
import TagFavoriteButton from "./TagFavoriteButton.vue";
import { useFavoritesStore } from "@/services/FavoriteStore";
import { usePostsStore, useShortcutService, useUrlStore } from "@/services";
import type { ITag } from "./ITag";
import SearchFilters from "./SearchFilters.vue";
import type { InternalItem } from "vuetify";

interface ITagWithText extends ITag {
  text: string;
}

type ListItem = ITagWithText;

const replacements: Record<string, string | undefined> = {
  "rating:e": "rating:explicit",
  "rating:q": "rating:questionable",
  "rating:s": "rating:safe",
};

const props = defineProps(
  {
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
  }
)

const emit = defineEmits<{
  (e: "add-tag", tag: string): void;
  (e: "remove-tag", tag: string): void;
  (e: "confirm-search"): void;
}>();

const urlStore = useUrlStore();
const shortcutService = useShortcutService();
const posts = usePostsStore();
const favoritesStore = useFavoritesStore();
const search = ref("");
const tagsLoading = ref(false);
const loadedTags = ref<ITagWithText[]>([]);
const searchAsTag = computed(() =>
  (search.value || "").replace(/\s/g, "_"),
);
const inverted = computed(() => searchAsTag.value.startsWith("-"));
const stripSymbols = (str?: string) => (str || "").replace(/\W+/g, "");

const addTag = (tag: string) =>
  emit("add-tag", replacements[tag] || tag);

const filter = (itemText: string, queryText: string, item: InternalItem<ListItem> | undefined) => {
  if (!item) return false
  if ("header" in item) return false;
  const text = stripSymbols(itemText);
  const query = stripSymbols(queryText);
  const display = stripSymbols(item.raw.name);
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
  const list = [...favorites.value, ...loadedTags.value];
  const uniqueList = uniqBy(list, (item) => item.text);
  const sortedList = sortBy(uniqueList, (item => item.post_count ? -item.post_count : 0));
  const tagsValue = inverted.value
    ? sortedList.map((t) => ({ ...t, text: `-${t.text}` }))
    : sortedList;
  return tagsValue;
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

    loadedTags.value = [
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

const delayedSearchValue = ref<string | null>(null);

watch(
  () => search.value,
  (cur, prev) => {
    console.log("search value changed", search.value)
    if (searchAsTag.value) fetchTags(searchAsTag.value.replace(/^-/, ""));
    nextTick(() => {
      delayedSearchValue.value = search.value;
    });
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
        emit("remove-tag", item);
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
  if (!delayedSearchValue.value) {
    combobox.value.blur();
    emit("confirm-search");
  }
};
</script>
