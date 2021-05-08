<template>
  <v-dialog
    :value="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    persistent
  >
    <div class="fullscreen grey darken-4">
      <div class="flex">
        <div
          v-show="prevousNextButtons"
          class="left"
          v-ripple="hasPreviousFullscreenPost"
          @click="showPreviousImage"
        >
          <v-icon size="50" v-if="hasPreviousFullscreenPost">
            mdi-chevron-left
          </v-icon>
        </div>
        <zoom-pan-image
          @swipe-down="!$event.zoomedIn && exitFullscreen()"
          @swipe-right="!$event.zoomedIn && showPreviousImage()"
          @swipe-left="!$event.zoomedIn && showNextImage()"
        >
          <div
            v-if="current"
            style="height: 100%"
            class="middle black"
            :class="blacklistClasses"
          >
            <div v-if="current.file_ext == 'swf'" class="overflow flash">
              flash is not supported
            </div>
            <video
              v-else-if="current.file_ext == 'webm' && currentFileUrl"
              class="overflow flash black position-relative"
              controls
              loop
              autoplay
              preload=""
            >
              <source :src="current.file_url" type="video/webm" />
              Video type not supported by your browser
            </video>
            <div v-else class="overflow">
              <div
                class="zoom-container text-xs-center"
                style="position: relative"
              >
                <transition
                  :enter-active-class="enterTransitionName"
                  :leave-active-class="leaveTransitionName"
                  mode="in-out"
                >
                  <div
                    :key="currentFileUrl"
                    style="
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      left: 0;
                    "
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
                      :class="{
                        grey: false,
                        'darken-3': false,
                        hidden: loading,
                      }"
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
        </zoom-pan-image>
        <div
          v-show="prevousNextButtons"
          class="right"
          v-ripple="hasNextFullscreenPost"
          @click="showNextImage"
        >
          <v-icon size="50" v-if="hasNextFullscreenPost">
            mdi-chevron-right
          </v-icon>
        </div>
      </div>
      <div class="top-right" v-ripple @click.stop="exitFullscreen">
        <v-icon size="40" class="ml-2 mt-2">mdi-close</v-icon>
      </div>
      <div
        :class="{
          'bottom-right': buttonLayout.startsWith('br'),
          'bottom-left': buttonLayout.startsWith('bl'),
          'top-left': buttonLayout.startsWith('tl'),
        }"
      >
        <post-buttons
          v-if="current"
          :key="current.id"
          :buttons="buttons"
          :post="current"
          @open-post-details="$emit('open-post-details', $event)"
          @open-post-fullscreen="exitFullscreen()"
        />
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { GETTERS, ACTIONS } from "../store/constants";
import scrollIntoView from "scroll-into-view";
import Logo from "../components/updated/dumb/Logo.vue";
import { appearanceService, blacklistService, postService } from "@/services";
import ZoomPanImage from "./ZoomPanImage.vue";
import { useBlacklistClasses } from "../utilities/blacklist";
import { computed, defineComponent } from "@vue/composition-api";
import PostButtons from "@/Post/PostButtons.vue";
import { useDirectionalTransitions } from "@/misc/util/directionalTransitions";

export default defineComponent({
  metaInfo() {
    return {
      // title: this.current
      //   ? this.current.id
      //   : this.$store.state.routerModule.query.tags || "Browsing",
      // titleTemplate:
      //   this.current || !this.$store.state.routerModule.query.tags
      //     ? `${this.$appName} - %s`
      //     : `%s - ${this.$appName} Search`,
    };
  },
  components: {
    Logo,
    PostButtons,
    ZoomPanImage,
  },
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
  setup(props) {
    const postIsBlacklisted = computed(() =>
      Boolean(props?.current?._postCustom?.isBlacklisted),
    );
    const { classes: blacklistClasses } = useBlacklistClasses({
      mode: blacklistService.mode,
      postIsBlacklisted,
    });

    const buttons = computed(() => postService.fullscreenButtons);

    const {
      enterTransitionName,
      leaveTransitionName,
      setTransitionNames,
    } = useDirectionalTransitions({
      transitionName() {
        return appearanceService.fullscreenTransition;
      },
    });

    return {
      blacklistClasses,
      buttons,
      enterTransitionName,
      leaveTransitionName,
      setTransitionNames,
    };
  },
  data() {
    return {
      switched: false,
      loading: false,
    };
  },
  mounted() {
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
    },
    exitFullscreen() {
      this.$emit("close");
    },
    showNextImage() {
      if (!this.hasNextFullscreenPost) return;
      this.loadStart();
      this.$emit("next-post");
      this.setTransitionNames("right");
    },
    showPreviousImage() {
      if (!this.hasPreviousFullscreenPost) return;
      this.loadStart();
      this.$emit("previous-post");
      this.setTransitionNames("left");
    },
  },
  watch: {
    current(val, prev) {
      if (val && (!prev || val.id != prev.id)) {
        this.scrollIntoView();
        this.switched = true;
        this.$nextTick(() => {
          this.switched = false;
          if (val)
            this.$nextTick(() => {
              this.loading = true;
            });
        });
      }
    },
  },
  computed: {
    prevousNextButtons() {
      const layout = this.$store.getters[
        GETTERS.FULLSCREEN_PREVIOUS_NEXT_LAYOUT
      ];
      return (
        layout != "never" &&
        ((!this.zoomedIn && layout == "zoom") || layout == "always")
      );
    },
    buttonLayout() {
      return this.$store.getters[GETTERS.FULLSCREEN_BUTTONS_LAYOUT];
    },
    // zoomEnabled() {
    //   return !!(this.current && this.current.file_ext !== "swf");
    // },
    // loggedIn() {
    //   return this.$store.getters[GETTERS.IS_LOGGED_IN];
    // },
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
});
</script>

<style scoped lang="scss">
.position-relative {
  position: relative;
}

.centered-in-container {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
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
    width: 60px;
    height: 60px;

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

// .flash {
//   position: absolute;
//   height: 100%;
//   width: 100%;
// }
</style>
