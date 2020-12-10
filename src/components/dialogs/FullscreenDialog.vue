<template>
  <v-dialog
    :value="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    persistent
  >
    <div class="fullscreen grey darken-4" v-if="current">
      <div class="flex">
        <div
          v-show="prevousNextButtons"
          class="left"
          v-ripple="hasPreviousFullscreenPost"
          @click="showPreviousImage"
        >
          <v-btn
            dark
            large
            icon
            :ripple="false"
            v-if="hasPreviousFullscreenPost"
          >
            <v-icon size="50">mdi-chevron-left</v-icon>
          </v-btn>
        </div>
        <div
          ref="middle"
          class="middle black"
          @wheel="onScroll"
          @mousewheel="onScroll"
          :class="{
            'blacklist-blur': blacklistMode == 'blur',
            'blacklist-black': blacklistMode == 'black',
          }"
        >
          <object
            v-if="current.file_ext == 'swf' && currentFileUrl"
            class="overflow flash grey"
          >
            <param name="movie" :value="current.file_url" />
            <embed
              type="application/x-shockwave-flash"
              :src="current.file_url"
              allowscriptaccess="never"
            />
          </object>
          <video
            v-else-if="current.file_ext == 'webm' && currentFileUrl"
            class="overflow flash black"
            controls
            loop
            autoplay
            preload=""
          >
            <source :src="current.file_url" type="video/webm" />
            Video type not supported by your browser
          </video>
          <div
            v-else
            ref="overflow"
            class="overflow"
            @mousemove="onMouseMove"
            @mousedown.prevent="onMouseDown"
            @mouseup="onMouseUp"
          >
            <div
              :style="containerStyle"
              ref="zoom"
              class="zoom-container text-xs-center"
              style="position: relative;"
            >
              <transition
                :enter-active-class="enterTransitionName"
                :leave-active-class="leaveTransitionName"
                mode="in-out"
              >
                <div
                  :key="currentFileUrl"
                  style=" position: absolute; width: 100%; height: 100%; left: 0;"
                >
                  <img
                    v-if="currentSampleFileUrl"
                    :class="{ grey: false, 'darken-3': false }"
                    :src="currentSampleFileUrl"
                  />
                  <img
                    v-if="currentFileUrl"
                    @loadstart="loadStart"
                    @load="loadEnd"
                    :class="{ grey: false, 'darken-3': false, hidden: loading }"
                    :src="currentFileUrl"
                  />
                </div>
              </transition>
              <logo
                class="centered-in-container"
                svg-margin-auto
                v-if="loading"
                :loader="loading"
              />
            </div>
          </div>
        </div>
        <div
          v-show="prevousNextButtons"
          class="right"
          v-ripple="hasNextFullscreenPost"
          @click="showNextImage"
        >
          <v-btn dark large icon :ripple="false" v-if="hasNextFullscreenPost">
            <v-icon size="50">mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="top-right" v-ripple @click.stop="exitFullscreen">
        <v-btn dark large class="mr-2 mt-2" icon :ripple="false">
          <v-icon size="40">mdi-close</v-icon>
        </v-btn>
      </div>
      <div
        :class="{
          'bottom-right': buttonLayout.startsWith('br'),
          'bottom-left': buttonLayout.startsWith('bl'),
          'top-left': buttonLayout.startsWith('tl'),
        }"
      >
        <v-card class="ma-3 pa-1" v-if="buttonLayout.endsWith('c')" dark>
          <post-buttons
            ref="postButtonsRef"
            v-if="current"
            :post="current"
            :key="current.id"
            large
            fullscreen
          />
        </v-card>
        <post-buttons
          ref="postButtonsRef"
          v-else-if="current"
          :post="current"
          :key="current.id"
          large
          fullscreen
        />
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { GETTERS, ACTIONS } from "../../store/constants";
import scrollIntoView from "scroll-into-view";
import Logo from "../Logo.vue";
import { togglePostFavorite } from "../../utilities/mixins";
import PostButtons from "../PostButtons.vue";
import Hammer from "hammerjs";
import { getTransitionName } from "../../utilities";

export default {
  metaInfo() {
    return {
      title: this.current
        ? this.current.id
        : this.$store.state.routerModule.query.tags || "Browsing",
      titleTemplate:
        this.current || !this.$store.state.routerModule.query.tags
          ? `${this.$appName} - %s`
          : `%s - ${this.$appName} Search`,
    };
  },
  components: {
    Logo,
    PostButtons,
  },
  mixins: [togglePostFavorite],
  props: {
    hasPreviousFullscreenPost: {
      type: Boolean,
      required: true,
    },
    hasNextFullscreenPost: {
      type: Boolean,
      required: true,
    },
    current: {
      required: true,
    },
  },
  data() {
    const initialZoom = {
      top: 0,
      left: 0,
      level: 1,
      mouseDown: false,
      startX: 0,
      startY: 0,
      startLevel: 0,
    };
    return {
      enterTransitionName: "fade",
      leaveTransitionName: "fade",
      switched: false,
      loading: false,
      zoom: initialZoom,
      initialZoom,
    };
  },
  mounted() {
    this.enableTouchRecognizer();
    window.addEventListener("keydown", this.keyDown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyDown);
  },
  created() {
    this.loadTimeout = null;
  },
  methods: {
    keyDown(event) {
      if (!this.current) return;
      if (event.key == "ArrowLeft" || event.key == "a") {
        this.showPreviousImage();
      }
      if (event.key == "ArrowRight" || event.key == "d") {
        this.showNextImage();
      }
      if (
        event.key == "Escape" ||
        event.key == "ArrowDown" ||
        event.key == "s"
      ) {
        this.exitFullscreen();
      }
    },
    openDetails() {
      // TODO
      this.$store.dispatch(ACTIONS.SET_DETAILS_VIEW, {
        id: this.current.id,
      });
    },
    scrollIntoView() {
      const post = document.getElementById(`post_${this.current.id}`);
      if (post) scrollIntoView(post);
    },
    loadStart() {
      clearTimeout(this.loadTimeout);

      this.loadTimeout = setTimeout(() => {
        this.loading = true;
      }, 10);
    },
    loadEnd() {
      clearTimeout(this.loadTimeout);
      this.loading = false;
      this.enableTouchRecognizer();
    },
    exitFullscreen() {
      this.$emit("close");
    },
    setTransitionNames(right, initial = false) {
      const { enterTransitionName, leaveTransitionName } = getTransitionName(
        this.transitionName,
        right ? "left" : "right",
      );
      this.enterTransitionName = enterTransitionName;
      this.leaveTransitionName = leaveTransitionName;
    },
    showNextImage() {
      if (!this.hasNextFullscreenPost) return;
      this.loadStart();
      this.$emit("next-post");
      this.setTransitionNames(false);
    },
    showPreviousImage() {
      if (!this.hasPreviousFullscreenPost) return;
      this.loadStart();
      this.$emit("previous-post");
      this.setTransitionNames(true);
    },
    enableTouchRecognizer() {
      if (!this.zoomEnabled || !this.$refs.zoom || !this.$refs.middle) return;
      if (this.hammer) this.hammer.destroy();
      this.hammer = new Hammer.Manager(this.$refs.middle, {
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
      this.hammer.on("swipeleft", (event) => {
        if (this.zoomedIn) return;
        this.showNextImage();
      });
      this.hammer.on("swiperight", (event) => {
        if (this.zoomedIn) return;
        this.showPreviousImage();
      });
      this.hammer.on("swipedown", (event) => {
        if (this.zoomedIn) return;
        this.exitFullscreen();
      });
      this.hammer.on("pinchstart", () => {
        this.zoom.startLevel = this.zoom.level;
      });
      this.hammer.on("pinchin", this.onScroll);
      this.hammer.on("pinchout", this.onScroll);
      this.hammer.on("panstart", (event) => {
        this.zoom.startX = event.center.x;
        this.zoom.startY = event.center.y;
      });
      this.hammer.on("panmove", this.onPan);
      this.hammer.on("tap", this.onScroll);

      this.zoom = { ...this.initialZoom };
      this.constrainZoom();
    },
    onScroll(event) {
      if (!this.zoomEnabled || !this.$refs.zoom || !this.$refs.middle) return;
      const oldLevel = this.zoom.level;
      if (event.type == "pinchin" || event.type == "pinchout") {
        event.clientX = event.center.x;
        event.clientY = event.center.y;
        this.zoom.level = this.zoom.startLevel * event.scale;
      } else if (event.type == "tap") {
        event.clientX = event.center.x;
        event.clientY = event.center.y;
        if (event.tapCount == 2) {
          if (this.zoom.level == 1) {
            this.zoom.level = 2;
          } else {
            this.zoom.level = 1;
          }
        }
      } else {
        const zoomOut = event.deltaY > 0;
        this.zoom.level *= zoomOut ? 0.9 : 1.1;
      }
      this.zoom.level = Math.min(Math.max(1, this.zoom.level), 100);

      const mouseOffset = {
        x: event.clientX - this.$refs.middle.getBoundingClientRect().x,
        y: event.clientY - this.$refs.middle.getBoundingClientRect().y,
      };

      const left =
        ((mouseOffset.x + this.zoom.left) * this.zoom.level) / oldLevel -
        mouseOffset.x;
      const top =
        ((mouseOffset.y + this.zoom.top) * this.zoom.level) / oldLevel -
        mouseOffset.y;

      this.zoom.top = top;
      this.zoom.left = left;

      this.$nextTick(() => {
        this.constrainZoom();
      });
    },
    onMouseUp() {
      this.zoom.mouseDown = false;
    },
    onMouseDown(event) {
      this.zoom.mouseDown = true;
      // this.zoom.startX = event.screenX;
      // this.zoom.startY = event.screenY;
    },
    onMouseMove(event) {
      // if (!this.zoomEnabled || !this.$refs.zoom || !this.$refs.middle) return;
      // if (!this.zoom.mouseDown) return;
      // if (!(event.buttons & 1)) return;
      // const x = event.screenX,
      //   y = event.screenY;
      // const dx = x - this.zoom.startX,
      //   dy = y - this.zoom.startY;
      // this.zoom.left -= dx;
      // this.zoom.top -= dy;
      // this.zoom.startX = x;
      // this.zoom.startY = y;
      // this.constrainZoom();
    },
    onPan(event) {
      if (!this.zoomEnabled || !this.$refs.zoom || !this.$refs.middle) return;
      // if (!this.zoom.mouseDown) return;
      // if (!(event.buttons & 1)) return;
      // const x = event.screenX,
      //   y = event.screenY;
      const { x, y } = event.center;
      const dx = x - this.zoom.startX,
        dy = y - this.zoom.startY;

      this.zoom.left -= dx;
      this.zoom.top -= dy;

      this.zoom.startX = x;
      this.zoom.startY = y;

      this.constrainZoom();
    },
    constrainZoom() {
      if (!this.zoomEnabled || !this.$refs.zoom || !this.$refs.middle) return;
      const padding = 0;
      const constraints = {
        left: {
          min: 0 - padding,
          max:
            this.$refs.zoom.getBoundingClientRect().width -
            this.$refs.middle.getBoundingClientRect().width +
            padding,
        },
        top: {
          min: 0 - padding,
          max:
            this.$refs.zoom.getBoundingClientRect().height -
            this.$refs.middle.getBoundingClientRect().height +
            padding,
        },
      };

      this.zoom.left = Math.min(
        Math.max(this.zoom.left, constraints.left.min),
        constraints.left.max,
      );
      this.zoom.top = Math.min(
        Math.max(this.zoom.top, constraints.top.min),
        constraints.top.max,
      );
    },
  },
  watch: {
    current(val, prev) {
      if (val.id != prev.id) {
        this.scrollIntoView();
        this.switched = true;
        this.$nextTick(() => {
          this.switched = false;
          if (val)
            this.$nextTick(() => {
              this.enableTouchRecognizer();
              this.loading = true;
            });
        });
      }
    },
  },
  computed: {
    transitionName() {
      return this.$store.getters[GETTERS.FULLSCREEN_TRANSITION];
    },
    blacklistMode() {
      if (this.current && this.current.custom_blacklisted_by_user) {
        return this.$store.getters[GETTERS.BLACKLIST_MODE]; // blur, black
      }
      return false;
    },
    prevousNextButtons() {
      const layout = this.$store.getters[
        GETTERS.FULLSCREEN_PREVIOUS_NEXT_LAYOUT
      ];
      return (
        layout != "never" &&
        ((!this.zoomedIn && layout == "zoom") || layout == "always")
      );
    },
    zoomedIn() {
      return this.zoom.level > 1 && !this.loading;
    },
    buttonLayout() {
      return this.$store.getters[GETTERS.FULLSCREEN_BUTTONS_LAYOUT];
    },
    zoomEnabled() {
      return !!(this.current && this.current.file_ext !== "swf");
    },
    containerStyle() {
      const zoom = this.loading || !this.current ? this.initialZoom : this.zoom;
      const style = {
        "transform-origin": "top left",
        transform: `translate(${-zoom.left}px, ${-zoom.top}px) scale(${
          zoom.level
        })`,
        display: "block",
      };
      return style;
    },
    loggedIn() {
      return this.$store.getters[GETTERS.IS_LOGGED_IN];
    },
    currentFileUrl() {
      return this.switched ? false : this.current.file_url;
    },
    currentSampleFileUrl() {
      return this.switched ? false : this.current.preview_url;
    },
    open() {
      return !!this.current;
    },
  },
};
</script>

<style scoped lang="stylus">
.no-mode-translate-fade-right-enter-active, .no-mode-translate-fade-right-leave-active {
  transition: all 0.6s ease;
}

.no-mode-translate-fade-right-enter, .no-mode-translate-fade-right-leave-active {
  opacity: 0;
}

.no-mode-translate-fade-right-enter {
  transform: translateX(100%);
}

.no-mode-translate-fade-right-leave-active {
  transform: translateX(-100%);
}

.no-mode-translate-fade-left-enter-active, .no-mode-translate-fade-left-leave-active {
  transition: all 0.6s ease;
}

.no-mode-translate-fade-left-enter, .no-mode-translate-fade-left-leave-active {
  opacity: 0.9;
}

.no-mode-translate-fade-left-enter {
  transform: translateX(-100%);
}

.no-mode-translate-fade-left-leave-active {
  transform: translateX(100%);
}

// ----------------------------
.centered-in-container {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
}

.image-left-enter-active, .image-left-leave-active, .image-right-enter-active, .image-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  // .3s
}

.image-left-enter, .image-left-leave-to {
  transform: translateX(-100vw);
}

.image-right-enter, .image-right-leave-to {
  transform: translateX(100vw);
}

.hidden {
  // visibility: hidden;
  opacity: 0.1;
}

.fullscreen {
  z-index: 199;
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;

  .flex {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100vh;
    width: 100%;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 60px;
    }

    .middle {
      position: relative;
      flex-grow: 1;
      overflow: hidden;

      .overflow {
        overflow: hidden; // position: absolute;
        height: 100%;
        width: 100%;

        .zoom-container {
          height: 100%;
          width: 100%;
          position: relative;

          img {
            max-height: 100%;
            max-width: 100%;
            height: 100%;
            width: 100%;
            display: inline-block;
            object-fit: contain;
            top: 0;
            left: 0;
            position: absolute;
          }
        }
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 60px;
    }
  }

  .top-right {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1005;

    button {
      float: right;
    }
  }

  .bottom-right {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1006;

    button {
      float: right;
    }
  }

  .bottom-left {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1006;

    button {
      float: left;
    }
  }

  .top-left {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1006;

    button {
      float: left;
    }
  }
}

.flash {
  position: absolute;
  height: 100%;
  width: 100%;
}

.blacklist-black {
  filter: brightness(0.02);
}

.blacklist-blur {
  filter: blur(7px) !important;
  // transform: scale(0.99);
}
</style>
