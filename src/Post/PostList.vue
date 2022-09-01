<template>
  <!-- grid -->
  <!-- <v-layout v-if="layout === 'grid'" wrap="">
    <v-flex
      v-for="post in visiblePosts"
      :key="post.id"
      v-bind="gridSizes"
      ref="posts"
    >
      <slot name="post" :post="post" />
    </v-flex>
  </v-layout> -->
  <!-- blog/feed -->
  <!-- v-else -->
  <v-flex xs12 lg6 md8 offset-lg3 offset-md2 wrap="">
    <v-flex
      :key="post.id"
      xs12
      class="mb-5"
      v-for="post in visiblePosts"
      ref="posts"
    >
      <slot name="post" :post="post" />
    </v-flex>
  </v-flex>
</template>

<script lang="ts">
import { Post } from "@/worker/api";
import { EnhancedPost } from "@/worker/ApiService";
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
  PropType,
  watchEffect,
} from "vue";

const isAnyPartOfElementInViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
};

const getOffset = (el: Element) => {
  let curEl:
    | {
        offsetTop?: number;
        scrollTop: number;
        offsetParent?: Element | null;
      }
    | null
    | undefined = el;
  let top = 0;
  do {
    top += (curEl.offsetTop || 0) - curEl.scrollTop;
  } while ((curEl = curEl?.offsetParent));
  return top;
};

export default defineComponent({
  props: {
    visiblePosts: {
      type: Array as PropType<EnhancedPost[]>,
      required: true,
    },
  },
  setup(props, context) {
    const layout = ref<"list" | "grid">("list");
    const size = ref<"sm" | "md" | "lg">("md");
    const firstVisibleElement = ref<Element | null>(null);

    const handleScroll = (event: Event) => {
      if (!props.visiblePosts.length || !context.refs.posts) return;
      firstVisibleElement.value =
        (context.refs.posts as Element[]).find((post) =>
          isAnyPartOfElementInViewport(post),
        ) || null;
      // window.scroll(window.scrollX, window.scrollY + 100);
    };

    //   // return "gridmd"; // blog, feed(sm|md|xl), grid(sm|md|xl)
    onMounted(() => window.addEventListener("scroll", handleScroll));
    onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));

    // gridSizes() {
    //   return {
    //     xs6: this.size == "sm" || this.size == "md",
    //     sm4: this.size == "sm",
    //     md3: this.size == "sm",
    //     lg2: this.size == "sm",
    //     xl1: this.size == "sm",

    //     sm6: this.size == "md",
    //     md4: this.size == "md",
    //     lg3: this.size == "md",
    //     xl2: this.size == "md",

    //     xs12: this.size == "xl",
    //     sm12: this.size == "xl",
    //     md6: this.size == "xl",
    //     lg4: this.size == "xl",
    //     xl3: this.size == "xl",
    //   };
    // },

    const visiblePostIds = computed(() => props.visiblePosts.map((p) => p.id));

    // watchEffect(() => {
    //   console.log(
    //     firstVisibleElement.value && getOffset(firstVisibleElement.value),
    //   );
    // });

    watch(
      () => visiblePostIds.value,
      async () => {
        if (firstVisibleElement.value) {
          // get the offset between the first visible post and the top of the viewport (before the dom update)
          const el = firstVisibleElement.value;
          const oldScrollOffset = getOffset(el) - window.scrollY;
          await nextTick();
          // the dom has now been updated - scroll the view so the offset to the first post is the same as before the dom update
          const newScroll = getOffset(el) - oldScrollOffset;
          window.scrollTo({ top: newScroll });
        }
      },
    );

    return {
      layout,
      size,
    };
  },
});
</script>
