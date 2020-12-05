<template>
  <!-- masonry -->
  <masonry
    v-if="layout == 'masonry'"
    :size="size"
    :is-dialog="isDialog"
    :layout="layout"
    :visible-posts="visiblePosts"
  />
  <div v-else>
    <!-- grid -->
    <template v-if="!(layout == 'blog' || layout.startsWith('feed'))">
      <v-layout row wrap="">
        <template v-for="(post, index) in visiblePosts">
          <v-flex :key="index" v-bind="gridSizes">
            <post
              :key="post.id"
              :post="post"
              :is-dialog="isDialog"
              :size="size"
              :layout="layout"
            />
          </v-flex>
        </template>
      </v-layout>
    </template>
    <!-- blog/feed -->
    <v-flex
      v-else
      xs12
      lg6
      :offset-lg3="!layout.startsWith('feed')"
      :offset-lg2="layout.startsWith('feed')"
      md8
      :offset-md2="!layout.startsWith('feed')"
      :offset-md1="layout.startsWith('feed')"
      wrap=""
    >
      <template>
        <v-flex
          :key="index"
          xs12
          class="mb-5"
          v-for="(post, index) in visiblePosts"
        >
          <post
            :post="post"
            :key="post.id"
            :is-dialog="isDialog"
            :size="size"
            :layout="layout"
          />
        </v-flex>
      </template>
    </v-flex>
  </div>
</template>

<script>
import Masonry from "../components/Masonry.vue";
import Post from "./Post.vue";
import { GETTERS } from "../store/constants";

export default {
  components: {
    Post,
    Masonry,
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
    visiblePosts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    gridSizes() {
      return {
        xs6: this.size == "sm" || this.size == "md",
        sm4: this.size == "sm",
        md3: this.size == "sm",
        lg2: this.size == "sm",
        xl1: this.size == "sm",

        sm6: this.size == "md",
        md4: this.size == "md",
        lg3: this.size == "md",
        xl2: this.size == "md",

        xs12: this.size == "xl",
        sm12: this.size == "xl",
        md6: this.size == "xl",
        lg4: this.size == "xl",
        xl3: this.size == "xl",
      };
    },
    size() {
      const layout = this.$store.getters[GETTERS.POST_LAYOUT];
      if (
        layout.startsWith("grid") ||
        layout.startsWith("masonry") ||
        layout.startsWith("feed")
      ) {
        return layout.replace(/(grid|masonry|feed)/gi, "");
      }
      return "md";
    },
    layout() {
      return this.$store.getters[GETTERS.POST_LAYOUT].replace(
        /(sm|md|xl)$/gi,
        "",
      );
    },
  },
  methods: {},
};
</script>
