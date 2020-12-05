<template>
  <div :class="{ grid: true, [size]: true }">
    <template v-for="(post, index) in visiblePosts">
      <div class="item" :key="index" ref="items">
        <v-flex class="content">
          <post
            :post="post"
            :key="post.id"
            no-expand
            :is-dialog="isDialog"
            :size="size"
            :layout="layout"
          />
        </v-flex>
      </div>
    </template>
  </div>
</template>

<script>
import Post from "./Post.vue";
import imagesLoaded from "imagesloaded";
import debounce from "lodash.debounce";
import { GETTERS } from "../store/constants";

function resizeGridItem(item) {
  let grid = document.getElementsByClassName("grid")[0];
  let rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"),
  );
  let rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-row-gap"),
  );
  let rowSpan = Math.ceil(
    (item.querySelector(".content").getBoundingClientRect().height + rowGap) /
      (rowHeight + rowGap),
  );
  item.style.gridRowEnd = "span " + rowSpan;
}

const debouncedResizeAll = debounce(
  (items) => {
    for (let x = 0; x < items.length; x++) {
      resizeGridItem(items[x]);
    }
  },
  400,
  {
    trailing: true,
    maxWait: 800,
  },
);

export default {
  props: {
    size: {
      type: String,
    },
    isDialog: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
    },
    visiblePosts: {
      type: Array,
      required: true,
    },
  },
  components: {
    Post,
  },
  mounted() {
    window.removeEventListener("resize", this.resizeAllGridItems);
    window.addEventListener("resize", this.resizeAllGridItems);
    this.resizeAllGridItems();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeAllGridItems);
  },
  computed: {},
  watch: {
    visiblePosts(posts) {
      this.$nextTick(() => {
        if (this.$refs.items) {
          for (let x = 0; x < this.$refs.items.length; x++) {
            // imagesLoaded(this.$refs.items[x], instance => {
            //   setTimeout(() => resizeGridItem(this.$refs.items[x]));
            // }); // TODO: reenable if there are overlapping posts
            resizeGridItem(this.$refs.items[x]);
          }
        }
      });
    },
  },
  methods: {
    resizeAllGridItems() {
      if (this.$refs.items) debouncedResizeAll(this.$refs.items);
    },
  },
};
</script>

<style lang="stylus" scoped>
.grid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;

  .content {
  }

  &.sm {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  &.md {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  &.xl {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}
</style>
