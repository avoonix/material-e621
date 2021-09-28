<template>
  <!-- grid -->
  <v-layout v-if="layout === 'grid'" row wrap="">
    <v-flex
      v-for="post in visiblePosts"
      :key="post.id"
      v-bind="gridSizes"
      ref="posts"
    >
      <slot name="post" :post="post" />
    </v-flex>
  </v-layout>
  <!-- blog/feed -->
  <v-flex v-else xs12 lg6 md8 offset-lg3 offset-md2 wrap="">
    <v-flex
      :key="post.id"
      xs12
      class="mb-5"
      v-for="(post, idx) in visiblePosts"
      ref="posts"
    >
      <intersect
        @enter="triggerLoad(idx, 'enter', $event)"
        @leave="triggerLoad(idx, 'leave', $event)"
        :threshold="[0]"
        :root="null"
        root-margin="0px 0px 0px 0px"
        v-if="shouldHaveIntersectionObserver(idx)"
      >
        <!-- @change="say('change', $event)" -->
        <slot name="post" :post="post" />
      </intersect>
      <slot v-else name="post" :post="post" />
    </v-flex>
  </v-flex>
</template>

<script lang="ts">
import { Post } from "@/worker/api";
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
  PropType,
} from "@vue/composition-api";
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
      type: Array as PropType<Post[]>,
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
    const firstVisibleElement = ref<Element | null>(null);
    const lastLoad = ref<number>(0);

    watch(
      () => props.loading,
      () => {
        lastLoad.value = performance.now();
      },
    );

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

    watch(
      () => visiblePostIds.value,
      async () => {
        hasLeftElementThatTriggersPreviousPage.value = false;
        if (firstVisibleElement.value) {
          const el = firstVisibleElement.value;
          const oldScroll = getOffset(el);
          await nextTick();
          const newScroll = getOffset(el);
          window.scrollBy(0, newScroll - oldScroll);
        }
      },
    );

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
      console.log("TODO: trigger load");
      if (true as unknown) {
        return;
      }
      if (props.loading || lastLoad.value + 1000 > performance.now()) return; // limit to 1 load per second
      if (index === indexThatTriggersNextPage.value && name === "enter") {
        context.emit("load-next-page");
      } else if (index === indexThatTriggersPreviousPage.value) {
        if (name === "enter") {
          if (hasLeftElementThatTriggersPreviousPage.value) {
            context.emit("load-previous-page");
          }
        } else {
          hasLeftElementThatTriggersPreviousPage.value = true;
        }
      }
    };

    const shouldHaveIntersectionObserver = (index: number) => {
      return (
        index === indexThatTriggersPreviousPage.value ||
        index === indexThatTriggersNextPage.value
      );
    };

    const hasLeftElementThatTriggersPreviousPage = ref(false);

    return {
      layout,
      size,
      triggerLoad,
      shouldHaveIntersectionObserver,
    };
  },
});
</script>
