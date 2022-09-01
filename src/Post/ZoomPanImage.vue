<template>
  <div
    ref="middle"
    class="middle black"
    @wheel="onScroll"
    @mousewheel="onScroll"
  >
    <div
      ref="overflow"
      class="overflow"
      @mousedown.prevent="onMouseDown"
      @mouseup="onMouseUp"
    >
      <div
        :style="containerStyle"
        ref="zoom"
        class="zoom-container text-center"
        style="position: relative"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import Hammer from "hammerjs";
import clone from "clone";
import Vue from "vue";

export default defineComponent({
  setup(props, context) {
    const initialZoom = {
      top: 0,
      left: 0,
      level: 1,
      mouseDown: false,
      startX: 0,
      startY: 0,
      startLevel: 0,
    };

    const middle = ref<Element>();
    const zoom = ref<Element>();

    const currentZoom = reactive(clone(initialZoom));

    onMounted(() => {
      enableTouchRecognizer();
    });

    let hammer: HammerManager | null = null;

    const enableTouchRecognizer = () => {
      if (hammer) {
        hammer.destroy();
        hammer = null;
      }
      if(!middle.value) return;
      hammer = new Hammer.Manager(middle.value, {
        recognizers: [
          [Hammer.Tap],
          [Hammer.Pan, { threshold: 1 }],
          [
            Hammer.Swipe,
            { direction: Hammer.DIRECTION_ALL, threshold: 100 },
            ["pan"],
          ],
          [Hammer.Pinch, { enable: true, threshold: 0.01 }, ["pan"]],
        ],
      });
      hammer.on("swipeleft", (event) => {
        context.emit("swipe-left", zoomInfo.value);
      });
      hammer.on("swiperight", (event) => {
        context.emit("swipe-right", zoomInfo.value);
      });
      hammer.on("swipedown", (event) => {
        context.emit("swipe-down", zoomInfo.value);
      });
      hammer.on("swipeup", (event) => {
        context.emit("swipe-up", zoomInfo.value);
      });
      hammer.on("pinchstart", () => {
        currentZoom.startLevel = currentZoom.level;
      });
      hammer.on("pinchin", onScroll);
      hammer.on("pinchout", onScroll);
      hammer.on("panstart", (event) => {
        currentZoom.startX = event.center.x;
        currentZoom.startY = event.center.y;
      });
      hammer.on("panmove", onPan);
      hammer.on("tap", onScroll);

      Object.assign(currentZoom, initialZoom);
      constrainZoom();
    };

    const constrainZoom = () => {
      if(!middle.value || !zoom.value) return;
      const padding = 0;
      const constraints = {
        left: {
          min: 0 - padding,
          max:
            zoom.value.getBoundingClientRect().width -
            middle.value.getBoundingClientRect().width +
            padding,
        },
        top: {
          min: 0 - padding,
          max:
            zoom.value.getBoundingClientRect().height -
            middle.value.getBoundingClientRect().height +
            padding,
        },
      };

      currentZoom.left = Math.min(
        Math.max(currentZoom.left, constraints.left.min),
        constraints.left.max,
      );
      currentZoom.top = Math.min(
        Math.max(currentZoom.top, constraints.top.min),
        constraints.top.max,
      );
    };

    const onScroll = (event: any) => {
      const oldLevel = currentZoom.level;
      if (event.type == "pinchin" || event.type == "pinchout") {
        event.clientX = event.center.x;
        event.clientY = event.center.y;
        currentZoom.level = currentZoom.startLevel * event.scale;
      } else if (event.type == "tap") {
        event.clientX = event.center.x;
        event.clientY = event.center.y;
        if (event.tapCount == 2) {
          if (currentZoom.level == 1) {
            currentZoom.level = 2;
          } else {
            currentZoom.level = 1;
          }
        }
      } else {
        const zoomOut = event.deltaY > 0;
        currentZoom.level *= zoomOut ? 0.9 : 1.1;
      }
      currentZoom.level = Math.min(Math.max(1, currentZoom.level), 100);

      const mouseOffset = {
        x:
          event.clientX -
          (middle.value?.getBoundingClientRect().x ?? 0),
        y:
          event.clientY -
          (middle.value?.getBoundingClientRect().y ?? 0),
      };

      const left =
        ((mouseOffset.x + currentZoom.left) * currentZoom.level) / oldLevel -
        mouseOffset.x;
      const top =
        ((mouseOffset.y + currentZoom.top) * currentZoom.level) / oldLevel -
        mouseOffset.y;

      currentZoom.top = top;
      currentZoom.left = left;

      Vue.nextTick(() => {
        constrainZoom();
      });
    };

    const onPan = (event: any) => {
      const { x, y } = event.center;
      const dx = x - currentZoom.startX,
        dy = y - currentZoom.startY;

      currentZoom.left -= dx;
      currentZoom.top -= dy;

      currentZoom.startX = x;
      currentZoom.startY = y;

      constrainZoom();
    };

    const onMouseUp = () => {
      currentZoom.mouseDown = false;
    };

    const containerStyle = computed(() => {
      const zoom = currentZoom;
      const style = {
        "transform-origin": "top left",
        transform: `translate(${-zoom.left}px, ${-zoom.top}px) scale(${
          zoom.level
        })`,
        display: "block",
      };
      return style;
    });
    const onMouseDown = (event: any) => {
      currentZoom.mouseDown = true;
    };

    const zoomInfo = computed(() => {
      return { zoomedIn: currentZoom.level > 1 };
    });

    watch(
      () => zoomInfo.value.zoomedIn,
      (zoomedIn) => context.emit("update-zoomed", zoomedIn),
      { immediate: true },
    );

    return {
      onScroll,
      onMouseUp,
      onMouseDown,
      containerStyle,
      middle,
      zoom
    };
  },
});
</script>

<style scoped lang="scss">
.middle {
  position: relative;
  flex-grow: 1;
  overflow: hidden;

  .overflow {
    overflow: hidden;
    height: 100%;
    width: 100%;

    .zoom-container {
      height: 100%;
      width: 100%;
      position: relative;
    }
  }
}
</style>
