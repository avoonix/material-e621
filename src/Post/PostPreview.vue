<template>
  <fixed-aspect-ratio-box @click.native="handleClick" :ratio="file.height / file.width" v-ripple="true">
    <img :loading="loading" v-if="(isImage || isVideo) && imageSrc" :src="imageSrc" class="clickable" />
    <div v-else-if="isImage || isVideo" class="centered clickable play-button">
      <v-chip color="red" text-color="white">Global Blacklist</v-chip>
      <p class="pa-3 text-center">
        This post is on the server-side blacklist for unauthenticated users. Log
        in to view, or update the blacklist settings.
      </p>
    </div>
    <div v-if="isSwf" class="centered clickable" v-ripple>
      <v-icon size="100">mdi-flash</v-icon>
      <div>Flash</div>
    </div>
    <div v-else-if="isVideo" class="centered clickable play-button">
      <v-icon size="100">mdi-play</v-icon>
    </div>
  </fixed-aspect-ratio-box>
</template>

<script lang="ts">
import { useDataSaverInfo } from "@/misc/util/dataSaver";
import router from "@/router";
import { usePostsStore } from "@/services";
import { DataSaverType } from "@/services/types";
import { File, Preview, Sample } from "@/worker/api";
import { computed, defineComponent, PropType } from "vue";
import FixedAspectRatioBox from "./FixedAspectRatioBox.vue";

export default defineComponent({
  components: { FixedAspectRatioBox },
  props: {
    file: {
      type: Object as PropType<File>,
      required: true,
    },
    preview: {
      type: Object as PropType<Preview>,
      required: true,
    },
    sample: {
      type: Object as PropType<Sample>,
      required: true,
    },
  },
  setup(props, context) {
    const posts = usePostsStore();
    const isSwf = computed(() => props.file.ext === "swf");
    const isVideo = computed(() => props.file.ext === "webm");
    const isImage = computed(() => !isSwf.value && !isVideo.value);

    const handleClick = async () => {
      if (imageSrc.value) {
        context.emit("open-post");
      } else {
        const { appRouter } = await import("@/misc/util/router");
        appRouter.push({ name: "AccountSettings" });
      }
    };

    const { dataSaverInfo } = useDataSaverInfo();

    const imageSrcPerQuality = computed<{ high: string, low: string, medium: string }>(() => {
      if (isSwf.value) {
        return {
          high: props.preview.url,
          medium: props.preview.url,
          low: props.preview.url,
        };
      }
      if (isVideo.value) {
        return {
          high: props.sample.url || props.preview.url,
          medium: props.sample.url || props.preview.url,
          low: props.preview.url,
        };
      }
      return {
        high: props.file.url || props.sample.url || props.preview.url,
        medium: props.sample.url || props.preview.url,
        low: props.preview.url,
      };
    });

    const imageSrc = computed<string>(() => {
      switch (posts.dataSaver) {
        case DataSaverType.lowest:
          return imageSrcPerQuality.value.low;
        case DataSaverType.medium:
          return imageSrcPerQuality.value.medium;
        case DataSaverType.highest:
          return imageSrcPerQuality.value.high;
        default:
        case DataSaverType.auto:
          if (dataSaverInfo.value.effectiveTypeSupported && (dataSaverInfo.value.effectiveType === "slow-2g" || dataSaverInfo.value.effectiveType === "2g")) {
            return imageSrcPerQuality.value.low;
          }
          if (!dataSaverInfo.value.typeSupported) {
            if(dataSaverInfo.value.saveData) return imageSrcPerQuality.value.low;
            return imageSrcPerQuality.value.medium;
          }
          if (
            dataSaverInfo.value.type === "bluetooth" ||
            dataSaverInfo.value.type === "cellular"
          ) {
            return imageSrcPerQuality.value.low;
          }
          if (
            dataSaverInfo.value.type === "ethernet" ||
            dataSaverInfo.value.type === "wifi"
          ) {
            if (dataSaverInfo.value.saveData) {
              return imageSrcPerQuality.value.medium;
            }
            return imageSrcPerQuality.value.high;
          }
          return imageSrcPerQuality.value.medium;
      }
    });

    const loading = computed(() => {
      return posts.lazyLoad ? "lazy" : "eager";
    });

    return {
      isSwf,
      isVideo,
      isImage,
      imageSrc,
      handleClick,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped>
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.clickable {
  cursor: pointer;
}

.play-button {
  // z-index: 10;
  position: absolute;
  top: 0;
  height: 100%;
  pointer-events: none;
}
</style>
