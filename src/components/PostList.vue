<template>
  <!-- grid -->
  <v-layout v-if="!(layout == 'blog' || layout.startsWith('feed'))" row wrap="">
    <template v-for="(post, index) in visiblePosts">
      <v-flex :key="post.id" v-bind="gridSizes">
        <post
          :key="post.id"
          :post="post"
          :is-dialog="isDialog"
          :size="size"
          :layout="layout"
          ref="posts"
          @open-post="$emit('open-post', $event)"
          @open-post-details="$emit('open-post-details', $event)"
        />
      </v-flex>
    </template>
  </v-layout>
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
        :key="post.id"
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
          ref="posts"
          @open-post="$emit('open-post', $event)"
          @open-post-details="$emit('open-post-details', $event)"
        />
      </v-flex>
    </template>
  </v-flex>
</template>

<script>
import Post from "../Post/Post.vue";

function isAnyPartOfElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
}

export default {
  components: {
    Post,
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
    return {
      firstVisibleElement: null,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    visiblePosts: {
      async handler() {
        const printVals = (el) => {
          if (!el) {
            console.log("no el");
          }
          let top = 0;

          do {
            top += el.offsetTop - el.scrollTop;
          } while ((el = el.offsetParent));

          return top;
        };
        if (this.firstVisibleElement) {
          const el = this.firstVisibleElement.$el;
          const oldScroll = printVals(el);
          await this.$nextTick();
          const newScroll = printVals(el);

          window.scrollBy(0, newScroll - oldScroll);
        }
      },
    },
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
    POST_LAYOUT() {
      return "blog";
      // return "gridmd"; // blog, feed(sm|md|xl), grid(sm|md|xl)
    },
    size() {
      const layout = this.POST_LAYOUT;
      if (layout.startsWith("grid") || layout.startsWith("feed")) {
        return layout.replace(/(grid|feed)/gi, "");
      }
      return "md";
    },
    layout() {
      return this.POST_LAYOUT.replace(/(sm|md|xl)$/gi, "");
    },
  },
  methods: {
    handleScroll(event) {
      if (this.visiblePosts && this.$refs.posts) {
        this.firstVisibleElement = this.$refs.posts.find((post) =>
          isAnyPartOfElementInViewport(post.$el),
        );
        // window.scroll(window.scrollX, window.scrollY + 100);
      }
    },
  },
};
</script>
