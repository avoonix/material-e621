<template>
  <span class="d-flex">
    <v-combobox
      style="flex-grow: 999;"
      multiple
      small-chips
      dense
      attach
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
      :menu-props="{
        closeOnClick: false,
        closeOnContentClick: false,
        openOnClick: false,
        maxHeight: 500,
        offsetY: true,
        offsetOverflow: true,
        transition: 'slide-y-reverse-transition',
      }"
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
    <!-- <v-btn
      style="flex-grow: 0 !important; flex-shrink: 0 !important;"
      icon
      @click="searchPosts"
    > -->
    <!-- v-if="!blacklistMode && !standalone" -->
    <!-- <v-icon>mdi-magnify</v-icon>
    </v-btn> -->
    <!-- <recent-queries
      @item-selected="searchPosts"
      v-if="!blacklistMode && !standalone"
      style="flex-grow: 0 !important; flex-shrink: 0 !important;"
    /> -->
  </span>
</template>

<script lang="ts">
import TagLabel from "../dumb/TagLabel.vue";
import { debounce, differenceBy } from "lodash";
import Vue from "vue";
import { computed, defineComponent, ref, watch } from "@vue/composition-api";
import { getApiService } from "@/worker/services";
import { removeItem } from "localforage";

export default defineComponent({
  props: {
    label: {
      type: String,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  components: {
    TagLabel,
  },
  setup(props, context) {
    const search = ref("");
    const tagsLoading = ref(false);
    const tags = ref<any[]>([]); // TODO@avoo: types
    const searchAsTag = computed(() =>
      (search.value || "").replace(/\s/g, "_"),
    );
    const inverted = computed(() => searchAsTag.value.startsWith("-"));
    const stripSymbols = (str?: string) => (str || "").replace(/\W+/g, "");
    const filter = (item: any, queryText: string, itemText: string) => {
      if (item.header) return false;
      const text = stripSymbols(itemText);
      const query = stripSymbols(queryText);
      const display = stripSymbols(item.display);
      return (
        `${text}\n${display}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    };
    const items = computed(() => {
      const arr = [
        {
          header: "Start typing to search",
        },
        ...tags.value,
      ];
      return inverted.value
        ? arr.map((t) => ({ ...t, text: `-${t.text}` }))
        : arr;
    });
    const fetchTags = debounce(
      async (search: string) => {
        const count = 30; // TODO@avoo: get value from settings
        tagsLoading.value = true;
        const service = await getApiService();
        const result = await Promise.all([
          // TODO: error handling
          service.getTags({
            limit: count,
            order: "count",
            query: `*${search}*`,
          }),
          service.getPools({
            limit: count,
            order: "count",
            query: `*${search}*`,
          }),
        ]);

        tags.value = [
          ...result[0].map((t) => ({
            ...t,
            text: t.name,
            // // color: plugins.getTagColor(t.category),
            // display: t.name,
            // count: t.post_count,
          })),
          ...result[1].map((p) => ({
            ...p,
            text: `pool:${p.id}`,
            // name: "pool:" + p.id,
            // count: p.post_count,
            // type: "pool",
            // display: `${p.name} (pool)`,
          })),
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

    const model = computed<any[]>({
      // TODO: types
      get() {
        return props.tags.map((str) => {
          {
            return {
              text: str,
              // color: this.getTagColor(str), // FIXME: 350 ms js profiler
              // count
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
