<template>
  <!-- grid -->
  <!-- <v-row v-if="layout === 'grid'" row wrap="">
    <v-col
      v-for="post in visiblePosts"
      :key="post.id"
      v-bind="gridSizes"
      ref="posts"
    >
      <slot name="post" :post="post" />
    </v-col>
  </v-row> -->
  <!-- blog/feed -->
  <!-- v-else -->
  <v-col cols="12" lg="6" md="8" offset-lg="3" offset-md="2" wrap="">
    <v-col :key="post.id" cols="12" class="mb-5" v-for="(post, idx) in visiblePosts" :ref="(ref) => addElement(idx, ref as any)">
<!-- ((ref: Element | ComponentPublicInstance | null, refs: Record<string, any>) => void -->
      <!-- <intersect @enter="triggerLoad(idx, 'enter', $event)" @leave="triggerLoad(idx, 'leave', $event)" :threshold="[0]" -->
        <!-- :root="null" root-margin="0px 0px 0px 0px" v-if="shouldHaveIntersectionObserver(idx)"> -->
        <!-- @change="say('change', $event)" -->
        <slot name="post" :post="post" />
      <!-- </intersect> -->
      <!-- <slot v-else name="post" :post="post" /> -->
    </v-col>
  </v-col>
</template>

<script lang="ts">
import { usePostsStore } from "@/services";
import type { EnhancedPost } from "@/worker/ApiService";
import type { ComponentPublicInstance, PropType} from "vue";
import { computed, defineComponent, nextTick, onBeforeUnmount, onBeforeUpdate, onMounted, ref, watch } from "vue";
// import Intersect from "vue-intersect";

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
  components: {
    // Intersect,
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
  setup(props, context) {
    const layout = ref<"list" | "grid">("list");
    const size = ref<"sm" | "md" | "lg">("md");
    const firstVisibleElement = ref<ComponentPublicInstance | null>(null);
    const posts = ref<ComponentPublicInstance[]>([]);
    const hasLeftElementThatTriggersPreviousPage = ref(false);
    const canTriggerLoad = ref({ previous: false, next: false });
    const postsStore = usePostsStore();

    watch(props.visiblePosts,
      () => {
        canTriggerLoad.value = { next: true, previous: true };
      },
    );

    const handleScroll = (event: Event) => {
      if (!props.visiblePosts.length || !posts.value.length) return;
      firstVisibleElement.value =
        posts.value.find((post) =>
          isAnyPartOfElementInViewport(post.$el),
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

    //     cols="12": this.size == "xl",
    //     sm12: this.size == "xl",
    //     md="6": this.size == "xl",
    //     lg4: this.size == "xl",
    //     xl3: this.size == "xl",
    //   };
    // },

    const visiblePostIds = computed(() => props.visiblePosts.map((p) => p.id));
    watch(
      () => visiblePostIds.value,
      async () => {
        hasLeftElementThatTriggersPreviousPage.value = false;
        if (firstVisibleElement.value) {
          // get the offset between the first visible post and the top of the viewport (before the dom update)
          const el = firstVisibleElement.value;
          const oldScrollOffset = getOffset(el.$el) - window.scrollY;
          await nextTick();
          // the dom has now been updated - scroll the view so the offset to the first post is the same as before the dom update
          const newScroll = getOffset(el.$el) - oldScrollOffset;
          window.scrollTo({ top: newScroll });
        }
      },
    );

    onBeforeUpdate(() => {
      // Make sure to reset the refs before each update.
      posts.value = [];
    });

    const addElement = (idx: number, el: ComponentPublicInstance) => {
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
      if(!postsStore.autoLoad) return false;
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
    };
  },
});
</script>
