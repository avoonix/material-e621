<template>
  <v-dialog
    :value="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    persistent
  >
    <div class="fullscreen grey darken-4" ref="dialog">
      <div class="flex">
        <div
          v-show="!hideUi"
          class="left"
          v-ripple="hasPreviousFullscreenPost"
          @click="showPreviousImage"
        >
          <v-icon size="50" v-if="hasPreviousFullscreenPost">
            mdi-chevron-left
          </v-icon>
        </div>
        <zoom-pan-image
          @update-zoomed="isZoomed = $event"
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
            <div v-if="current.file.ext == 'swf'" class="overflow flash">
              flash is not supported
            </div>
            <video
              v-else-if="current.file.ext == 'webm' && currentFileUrl"
              class="overflow flash black position-relative"
              controls
              loop
              autoplay
              preload=""
            >
              <source :src="current.file.url" type="video/webm" />
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
                  type="loader"
                />
              </div>
            </div>
          </div>
        </zoom-pan-image>
        <div
          v-show="!hideUi"
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
      <div class="bottom-right" v-show="!hideUi">
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
import scrollIntoView from "scroll-into-view";
import Logo from "../App/Logo.vue";
import { appearanceService, blacklistService, postService } from "@/services";
import ZoomPanImage from "./ZoomPanImage.vue";
import { useBlacklistClasses } from "../misc/util/blacklist";
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  Ref,
  ref,
  watch,
} from "@vue/composition-api";
import PostButtons from "@/Post/PostButtons.vue";
import { useDirectionalTransitions } from "@/misc/util/directionalTransitions";
import { Post } from "@/worker/api";
import { EnhancedPost } from "@/worker/ApiService";

const appIsFullscreen = ref(!!document.fullscreenElement);

document.querySelector("#app")?.addEventListener("fullscreenchange", () => {
  appIsFullscreen.value = !!document.fullscreenElement;
});

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
      type: (null as unknown) as PropType<null | EnhancedPost>,
      required: true,
    },
  },
  setup(props, context) {
    const dialog = ref<Vue>();
    const lastFullscreenId = ref<number | null>();
    const isZoomed = ref(false);
    const postIsBlacklisted = computed(() =>
      Boolean(props?.current?.__meta.isBlacklisted),
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

    const hideUi = computed(
      () => postService.hideFullscreenUiOnZoom && isZoomed.value,
    );

    const exitFullscreen = () => context.emit("close");

    const loadTimeout: Ref<any> = ref(null);

    const loadStart = () => {
      clearTimeout(loadTimeout.value);

      loadTimeout.value = setTimeout(() => {
        loading.value = true;
      }, 10);
    };
    const loadEnd = () => {
      clearTimeout(loadTimeout.value);
      loading.value = false;
    };

    const showNextImage = () => {
      if (!props.hasNextFullscreenPost) return;
      loadStart();
      context.emit("next-post");
      setTransitionNames("right");
    };
    const showPreviousImage = () => {
      if (!props.hasPreviousFullscreenPost) return;
      loadStart();
      context.emit("previous-post");
      setTransitionNames("left");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!props.current) return;
      if (event.key == "ArrowLeft" || event.key == "a") {
        showPreviousImage();
      }
      if (event.key == "ArrowRight" || event.key == "d") {
        showNextImage();
      }
      if (
        event.key == "Escape" ||
        event.key == "ArrowDown" ||
        event.key == "s"
      ) {
        exitFullscreen();
      }
    };
    onMounted(() => {
      setTransitionNames("none");
      window.addEventListener("keydown", handleKeyDown);
    });
    onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyDown));

    const scrollToPost = (postId: number) => {
      const post = document.getElementById(`post_${postId}`);
      if (post)
        scrollIntoView(post, {
          time: 100,
        });
    };

    const switched = ref(false);
    const loading = ref(false);

    watch(
      () => props.current,
      async (val, prev) => {
        if (val) lastFullscreenId.value = val.id;
        if (val && (!prev || val.id != prev.id)) {
          scrollToPost(props.current!.id);
          switched.value = true;
          await nextTick();
          switched.value = false;
          if (val) {
            await nextTick();
            loading.value = true;
          }
        }
      },
    );

    const open = computed(() => !!props.current);

    const currentFileUrl = computed(() =>
      switched.value ? false : props.current?.file.url,
    );
    const currentSampleFileUrl = computed(() =>
      switched.value ? false : props.current?.preview.url,
    );

    watch(open, () => {
      if (!open.value) {
        setTransitionNames("none");
      }
      if (open.value && postService.goFullscreen) {
        // dialog.value?.requestFullscreen();
        document.querySelector("#app")?.requestFullscreen();
      } else {
        if (document.fullscreenElement) document.exitFullscreen();
        if (lastFullscreenId.value) {
          scrollToPost(lastFullscreenId.value);
        }
      }
    });

    watch(appIsFullscreen, () => {
      if (!appIsFullscreen.value && open.value) {
        exitFullscreen();
      }
    });

    return {
      blacklistClasses,
      buttons,
      enterTransitionName,
      leaveTransitionName,
      hideUi,
      isZoomed,
      loadEnd,
      currentFileUrl,
      currentSampleFileUrl,
      open,
      showNextImage,
      showPreviousImage,
      loading,
      loadStart,
      exitFullscreen,
      dialog,
    };
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
</style>
