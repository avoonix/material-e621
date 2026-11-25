<template>
  <fixed-aspect-ratio-box @click.native="handleClick" :ratio="files.original.height / files.original.width" v-ripple="true">
    <img :loading="loading" v-if="(isImage || isVideo) && imageSrc" :src="imageSrc" class="clickable" />
    <div v-else-if="isImage || isVideo" class="centered clickable play-button">
      <v-chip color="red">Global Blacklist</v-chip>
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
import { usePostsStore } from "@/services";
import { DataSaverType } from "@/services/types";
import type { PostFiles } from "@/worker/api";
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import FixedAspectRatioBox from "./FixedAspectRatioBox.vue";
import { useRouter } from "vue-router";
import { isVideoExt } from "@/misc/util/utilities";

export default defineComponent({
  components: { FixedAspectRatioBox },
  props: {
    files: {
      type: Object as PropType<PostFiles>,
      required: true,
    },
  },
  setup(props, context) {
    const posts = usePostsStore();
    const isSwf = computed(() => props.files.meta.ext === "swf");
    const isVideo = computed(() => isVideoExt(props.files.meta.ext));
    const isImage = computed(() => !isSwf.value && !isVideo.value);
        const router = useRouter()

    const handleClick = async () => {
      if (imageSrc.value) {
        context.emit("open-post");
      } else {
        router.push({ name: "AccountSettings" });
      }
    };

    const { dataSaverInfo } = useDataSaverInfo();

    const imageSrcPerQuality = computed<{ high: string | null, low: string | null, medium: string | null }>(() => {
      const preview = props.files.preview.jpg;
      const sample = props.files.sample.jpg;
      const original = props.files.original.url;
      if (isSwf.value) {
        return {
          high: preview,
          medium: preview,
          low: preview,
        };
      }
      if (isVideo.value) {
        return {
          high: sample || preview,
          medium: sample || preview,
          low: preview,
        };
      }
      return {
        high: original || sample || preview,
        medium: sample || preview,
        low: preview,
      };
    });

    const imageSrc = computed<string | null>(() => {
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

<style scoped>
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
	 position: absolute;
	 top: 0;
	 height: 100%;
	 pointer-events: none;
}
 
</style>
