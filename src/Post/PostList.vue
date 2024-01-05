<template>
  <!-- grid -->
  <v-layout v-if="layout === 'grid'" wrap="">
    <v-flex v-for="post in visiblePosts" :key="post.id" v-bind="gridSizes" ref="posts">
      <slot name="post" :post="post" />
    </v-flex>
  </v-layout>
  <!-- blog/feed -->
  <v-flex xs12 lg6 md8 offset-lg3 offset-md2 wrap="" v-else>
    <v-flex :key="post.id" xs12 class="mb-5" v-for="(post, idx) in visiblePosts" :ref="addElement(idx)">
      <intersect @enter="triggerLoad(idx, 'enter', $event)" @leave="triggerLoad(idx, 'leave', $event)" :threshold="[0]"
        :root="null" root-margin="0px 0px 0px 0px" v-if="shouldHaveIntersectionObserver(idx)">
        <!-- @change="say('change', $event)" -->
        <slot name="post" :post="post" />
      </intersect>
      <slot v-else name="post" :post="post" />
    </v-flex>
  </v-flex>
</template>

<script lang="ts">
import { usePostsStore } from "@/services";
import { EnhancedPost } from "@/worker/ApiService";
import { computed, defineComponent, inject, nextTick, onBeforeUnmount, onBeforeUpdate, onMounted, PropType, Ref, ref, watch } from "vue";
import Intersect from "vue-intersect";

const isAnyPartOfElementInViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
};

const breakpoints = {
  sm: 600,
  md: 960,
  lg: 1264,
  xl: 1904,
};

const getScreenSize = () => {
  const width = window.innerWidth;
  if (width < breakpoints.md) {
    return 'sm';
  } else if (width < breakpoints.lg) {
    return 'md';
  } else if (width < breakpoints.xl) {
    return 'lg';
  } else {
    return 'xl';
  }
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
  components: {
    Intersect,
  },
  props: {
    visiblePosts: {
      type: Array as PropType<EnhancedPost[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    gridSizes() {
      const isRestrainingSize = this.layout === "grid" && this.selectedGridSize != "Automatic";
      return {
        xs6: this.size == "sm" || this.size == "md" && !isRestrainingSize,
        sm4: this.size == "sm" && (!isRestrainingSize || this.selectedGridSize == 4),
        md3: this.size == "sm" && (!isRestrainingSize || this.selectedGridSize == 3),
        lg2: this.size == "sm" && (!isRestrainingSize || this.selectedGridSize == 2),
        xl1: this.size == "sm" && !isRestrainingSize,

        sm6: this.size == "md" && !isRestrainingSize,
        md4: this.size == "md" && (!isRestrainingSize || this.selectedGridSize == 4),
        lg3: this.size == "md" && (!isRestrainingSize || this.selectedGridSize == 3),
        xl2: this.size == "md" && (!isRestrainingSize || this.selectedGridSize == 2),

        xs12: this.size == "xl" && !isRestrainingSize,
        sm12: this.size == "xl" && !isRestrainingSize,
        md6: this.size == "xl" && !isRestrainingSize,
        lg4: this.size == "xl" && (!isRestrainingSize || this.selectedGridSize == 4),
        xl3: this.size == "xl" && (!isRestrainingSize || this.selectedGridSize == 3),
      };
    },
  },
  setup(props, context) {
    const layout = ref<"list" | "grid">("grid");
    const size = ref<"sm" | "md" | "lg" | "xl">("xl");
    const firstVisibleElement = ref<Element | null>(null);
    const posts = ref<Element[]>([]);
    const hasLeftElementThatTriggersPreviousPage = ref(false);
    const canTriggerLoad = ref({ previous: false, next: false });
    const postsStore = usePostsStore();

    watch(props.visiblePosts,
      () => {
        canTriggerLoad.value = { next: true, previous: true };
      },
    );

    const selectedGridSize = inject<Ref<"Automatic" | number>>("selectedGridSize")

    const handleScroll = (event: Event) => {
      if (!props.visiblePosts.length || !posts.value.length) return;
      firstVisibleElement.value =
        posts.value.find((post) =>
          isAnyPartOfElementInViewport(post),
        ) || null;
      // window.scroll(window.scrollX, window.scrollY + 100);
    };
    const updateLayoutAndSize = () => {
      if (selectedGridSize?.value == 1) {
        layout.value = 'list'
      } else {
        layout.value = 'grid'
      }
      size.value = getScreenSize();
    };

    //   // return "gridmd"; // blog, feed(sm|md|xl), grid(sm|md|xl)
    onMounted(() => {
      updateLayoutAndSize();
      window.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", updateLayoutAndSize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateLayoutAndSize);
    });

    watch([selectedGridSize], updateLayoutAndSize)

    const visiblePostIds = computed(() => props.visiblePosts.map((p) => p.id));
    watch(
      () => visiblePostIds.value,
      async () => {
        hasLeftElementThatTriggersPreviousPage.value = false;
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

    onBeforeUpdate(() => {
      // Make sure to reset the refs before each update.
      posts.value = [];
    });

    const addElement = (idx: number) => (el: Element) => {
      if (el) {
        posts.value[idx] = el;
      }
    }

    const indexThatTriggersPreviousPage = computed(() =>
      props.visiblePosts.length > 2 ? 1 : 0,
    );
    const indexThatTriggersNextPage = computed(() =>
      props.visiblePosts.length > 2
        ? props.visiblePosts.length - 2
        : props.visiblePosts.length - 1,
    );

    const triggerLoad = (
      index: number,
      name: "enter" | "leave",
      event: IntersectionObserverEntry,
    ) => {
      if (props.loading) return;
      if (index === indexThatTriggersNextPage.value && name === "enter" && canTriggerLoad.value.next) {
        context.emit("load-next-page");
        canTriggerLoad.value.next = false;
      } else if (index === indexThatTriggersPreviousPage.value) {
        if (name === "enter") {
          if (hasLeftElementThatTriggersPreviousPage.value && canTriggerLoad.value.previous) {
            context.emit("load-previous-page");
            canTriggerLoad.value.previous = false;
          }
        } else {
          hasLeftElementThatTriggersPreviousPage.value = true;
        }
      }
    };

    const shouldHaveIntersectionObserver = (index: number) => {
      if (!postsStore.autoLoad) return false;
      return (
        index === indexThatTriggersPreviousPage.value ||
        index === indexThatTriggersNextPage.value
      );
    };

    return {
      layout,
      size,
      posts,
      addElement,
      triggerLoad,
      shouldHaveIntersectionObserver,
      selectedGridSize
    };
  }
});
</script>
