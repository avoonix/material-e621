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
        <zoom-pan-image
          @swipe-down="!$event.zoomedIn && exitFullscreen()"
          @swipe-right="!$event.zoomedIn && showPreviousImage()"
          @swipe-left="!$event.zoomedIn && showNextImage()"
        >
          <div
            style="height: 100%"
            ref="middle"
            class="middle black"
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
            <div v-else ref="overflow" class="overflow">
              <div
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
            @open-post-details="$emit('open-post-details', $event)"
          />
        </v-card>
        <post-buttons
          ref="postButtonsRef"
          v-else-if="current"
          :post="current"
          :key="current.id"
          large
          fullscreen
          @open-post-details="$emit('open-post-details', $event)"
        />
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { GETTERS, ACTIONS } from "../../store/constants";
import scrollIntoView from "scroll-into-view";
import Logo from "../updated/dumb/Logo.vue";
import { togglePostFavorite } from "../../utilities/mixins";
import PostButtons from "../PostButtons.vue";
import { getTransitionName } from "../../utilities/transitions";
import { appearanceService } from "@/services";
import ZoomPanImage from "../updated/dumb/ZoomPanImage.vue";

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
    ZoomPanImage,
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
    return {
      enterTransitionName: "fade",
      leaveTransitionName: "fade",
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
              this.loading = true;
            });
        });
      }
    },
  },
  computed: {
    transitionName() {
      return appearanceService.fullscreenTransition;
    },
    blacklistMode() {
      // TODO: use blacklist service
      // if (this.current && this.current.custom_blacklisted_by_user) {
      //   return this.$store.getters[GETTERS.BLACKLIST_MODE]; // blur, black
      // }
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
    buttonLayout() {
      return this.$store.getters[GETTERS.FULLSCREEN_BUTTONS_LAYOUT];
    },
    // zoomEnabled() {
    //   return !!(this.current && this.current.file_ext !== "swf");
    // },
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
