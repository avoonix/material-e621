<template>
  <span class="d-flex">
    <v-combobox
      style="flex-grow: 999"
      solo
      multiple
      attach
      flat
      hide-selected
      autofocus
      clearable
      ref="combobox"
      v-model="model"
      :filter="filter"
      :hide-no-data="!search"
      :items="items"
      :search-input.sync="search"
      :label="label"
      :loading="tagsLoading ? 'accent' : false"
      hide-details
    >
      <template slot="no-data">
        <v-list-tile>
          <span class="subheading">
            <kbd class="primary">Enter</kbd> to add
          </span>
          <v-chip color="blue-grey lighten-2" label small>
            {{ searchAsTag }}
          </v-chip>
        </v-list-tile>
      </template>
      <!-- Tags within input -->
      <template
        v-if="item === Object(item)"
        slot="selection"
        slot-scope="{ item, parent, selected }"
      >
        <!-- TODO: close button -->
        <tag-label
          :tag="item"
          @click="parent.selectItem(item)"
          :selected="selected"
        />
      </template>
      <!-- Tags within dropdown -->
      <template slot="item" slot-scope="{ index, item, parent }">
        <v-list-tile-content>
          <tag-label :tag="item" />
        </v-list-tile-content>
        <!-- <v-list-tile-action>{{ item.count }}</v-list-tile-action> -->
      </template>
    </v-combobox>
  </span>
</template>

<script lang="ts">
import TagLabel, { ITag } from "./TagLabel.vue";
import { debounce, differenceBy } from "lodash";
import Vue from "vue";
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
} from "@vue/composition-api";
import { getApiService } from "@/worker/services";
import { postService } from "@/services";
import { categoryIdToCategoryName } from "@/misc/util/utilities";

interface ITagWithText extends ITag {
  text: string;
}

type ListItem = ITagWithText | { header: string };

export default defineComponent({
  props: {
    label: {
      type: String,
    },
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  components: {
    TagLabel,
  },
  setup(props, context) {
    const search = ref("");
    const tagsLoading = ref(false);
    const tags = ref<ITagWithText[]>([]); // TODO@avoo: types
    const searchAsTag = computed(() =>
      (search.value || "").replace(/\s/g, "_"),
    );
    const inverted = computed(() => searchAsTag.value.startsWith("-"));
    const stripSymbols = (str?: string) => (str || "").replace(/\W+/g, "");
    const filter = (item: ListItem, queryText: string, itemText: string) => {
      if ("header" in item) return false;
      const text = stripSymbols(itemText);
      const query = stripSymbols(queryText);
      const display = stripSymbols(item.name);
      return (
        `${text}\n${display}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    };
    const items = computed(() => {
      const tagsValue = inverted.value
        ? tags.value.map((t) => ({ ...t, text: `-${t.text}` }))
        : tags.value;
      const arr: ListItem[] = [
        {
          header: "Start typing to search",
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
            limit: postService.tagFetchLimit,
            order: "count",
            query: `*${search}*`,
          }),
          service.getPools({
            limit: postService.tagFetchLimit,
            order: "count",
            query: `*${search}*`,
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
        if (cur === null && prev !== null)
          Vue.nextTick(() => {
            search.value = prev;
          });
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
          context.emit("add-tag", newItem);
        }
        const removedItems = differenceBy(
          props.tags,
          val.map((v) => v.text),
        );
        if (removedItems.length) {
          for (const item of removedItems) {
            context.emit("remove-tag", item);
          }
        }
        const addedItems = differenceBy(
          val.map((v) => v.text),
          props.tags,
        );
        if (addedItems.length) {
          for (const item of addedItems) {
            context.emit("add-tag", item);
          }
        }
        // val = val.map((v) => {
        //   if (typeof v === "string") {
        //     v = {
        //       text: v.replace(/\s/g, "_"),
        //       color: "blue-grey",
        //     };
        //   }
        //   return v;
        // });
        // this.syncedTagString = str;
      },
    });

    return {
      search,
      searchAsTag,
      filter,
      items,
      tagsLoading,
      model,
    };
  },
});
</script>
