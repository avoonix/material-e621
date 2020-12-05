<template>
  <span class="d-flex">
    <v-combobox
      style="flex-grow: 999;"
      ref="combobox"
      v-model="model"
      :filter="filter"
      :hide-no-data="!search"
      :items="items"
      attach
      :search-input.sync="search"
      hide-selected
      :label="label"
      multiple
      small-chips
      dense
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
      :autofocus="true"
      clearable
    >
      <!-- :outline="!standalone && navMode !== 'im'"
      :clearable="!blacklistMode && !standalone"
      :error-messages="errorMessages"
      :solo="!standalone"
      :inverted="navMode == 'im'" -->
      <template slot="no-data">
        <v-list-tile>
          <span class="subheading">
            <kbd class="primary">Enter</kbd>to add
          </span>
          <v-chip color="blue-grey lighten-2" label small>{{
            (search || "").replace(/\s/g, "_")
          }}</v-chip>
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
        <v-list-tile-action>{{ item.count }}</v-list-tile-action>
      </template>
    </v-combobox>
    <v-btn
      style="flex-grow: 0 !important; flex-shrink: 0 !important;"
      icon
      @click="searchPosts"
    >
      <!-- v-if="!blacklistMode && !standalone" -->
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <!-- <recent-queries
      @item-selected="searchPosts"
      v-if="!blacklistMode && !standalone"
      style="flex-grow: 0 !important; flex-shrink: 0 !important;"
    /> -->
  </span>
</template>

<script>
import { GETTERS } from "../store/constants";
// import RecentQueries from "./RecentQueries.vue";
// import { ratingTags, metaTags } from "../config/customTags";
import { getApiService } from "../worker/services";
import debounce from "lodash.debounce";
import TagLabel from "./TagLabel";

const debouncedFetchTags = debounce(
  async (count, search, started, done) => {
    started();
    const service = await getApiService();
    const tags = service.getTags({
      limit: count,
      order: "count",
      query: `*${search}*`,
    });
    const pools = service.getPools({
      limit: count,
      order: "count",
      query: `*${search}*`,
    });
    const result = await Promise.all([tags, pools]);
    done([
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
    ]);
  },
  500,
  { trailing: true, maxWait: 3000 },
);

export default {
  props: {
    tagString: {
      // used with .sync modifier
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "Search tags",
    },
  },
  components: {
    // RecentQueries,
    TagLabel,
  },
  data: () => ({
    search: "",
    fetchedTags: [],
    tagsLoading: false,
    // menuVisible: false
  }),
  watch: {
    search(val, prev) {
      this.$nextTick(() => {
        if (val === null && prev !== null) this.search = prev;
      });
      if (val) {
        this.fetchTags(val.replace(/\s/g, "_").replace(/^\-/, ""));
      }
    },
  },
  methods: {
    fetchTags(search) {
      debouncedFetchTags(
        this.$store.getters[GETTERS.TAG_FETCH_COUNT],
        search,
        () => {
          this.tagsLoading = true;
        },
        (t) => {
          this.fetchedTags = t;
          this.tagsLoading = false;
        },
      );
    },
    searchPosts(event) {
      // TODO: loading not set in toolbar yet (todo: use portal?)
      // this.$store.dispatch("loadPosts", {
      //   reset: true,
      //   resetNoResults: true,
      // });
      // this.menuVisible = true;
      // this.$nextTick(() => {
      //   this.menuVisible = false;
      // });
      // this.$refs.combobox.isMenuActive = false;
      // this.$refs.combobox.hasFocused = true;
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = (val) => (val ? val.replace(/\s+/g, "_") : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);
      const display = hasValue(item.display);

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1 ||
        display
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    },
  },
  computed: {
    syncedTagString: {
      get() {
        return this.tagString;
      },
      set(str) {
        this.$emit("update:tagString", str);
      },
    },
    inverted() {
      if (this.search) {
        return (this.search || "").startsWith("-");
      }
      return false;
    },
    model: {
      get() {
        return this.syncedTagString
          .split(" ")
          .filter((str) => str.length > 0)
          .map((str) => {
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
        this.search = "";
        val = val.map((v) => {
          if (typeof v === "string") {
            v = {
              text: v.replace(/\s/g, "_"),
              color: "blue-grey",
            };
          }
          return v;
        });
        const str = val.map((t) => t.text).join(" ");
        this.syncedTagString = str;
      },
    },
    items() {
      const retVal = [
        {
          header: "Start typing to search",
        },
        ...this.fetchedTags,
      ];
      if (this.inverted) {
        return retVal.map((t) => ({
          ...t,
          text: "-" + t.text,
        }));
      }
      return retVal;
    },
  },
};
</script>
