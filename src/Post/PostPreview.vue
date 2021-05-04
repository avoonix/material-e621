<template>
  <fragment>
    <img v-if="isImage || isVideo" :src="imageSrc" class="clickable" />
    <div v-if="isSwf" class="centered clickable" v-ripple>
      <v-icon size="100">mdi-flash</v-icon>
      <div>Flash</div>
    </div>
    <div v-else-if="isVideo" class="centered clickable play-button">
      <v-icon size="100">mdi-play</v-icon>
    </div>
  </fragment>
  <!-- <video
                  v-if="post.file_ext == 'webm' && clicked"
                  controls
                  loop
                  :autoplay="true"
                  preload="none"
                >
                  <source :src="post.file_url" type="video/webm" />
                  Video type not supported by your browser
                </video>
                <div
                  v-else-if="post.file_ext == 'swf'"
                  class="centered clickable"
                  v-ripple
                >
                  <v-icon size="100">mdi-flash</v-icon>
                  <div>Flash</div>
                </div>
                <img
                  v-else-if="fastLoad || clicked"
                  :src="imageSrc"
                  :alt="allTags"
                />
                <img
                  v-else
                  v-lazy="{
                    src: imageSrc,
                    loading: post.preview_url,
                    error: post.preview_url,
                  }"
                  :alt="allTags"
                />
                <div
                  v-if="post.file_ext == 'webm' && !clicked"
                  class="centered clickable play-button"
                >
                  <v-icon size="100">mdi-play</v-icon>
                </div> -->
</template>

<script lang="ts">
import { File, Preview, Sample } from "@/worker/api";
import { computed, defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
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
    const isSwf = computed(() => props.file.ext === "swf");
    const isVideo = computed(() => props.file.ext === "webm");
    const isImage = computed(() => !isSwf.value && !isVideo.value);

    const imageSrc = computed(() => {
      if (isSwf.value) {
        return props.preview.url;
      }
      if (isVideo.value) {
        return props.sample.url;
      }
      return props.file.url;
      // imageSrc() {
      //   if (this.$store.getters[GETTERS.IS_LOW_RESOLUTION_MODE]) {
      //     if (this.clicked) {
      //       return this.post.file_url;
      //     }
      //     return this.post.preview_url;
      //   }
      //   if (this.post.file_ext == "webm") {
      //     return this.post.sample_url;
      //   }
      //   if (this.post.file_ext == "swf") {
      //     return this.post.preview_url;
      //   }
      //   return this.post.file_url;
      // },
    });

    return {
      isSwf,
      isVideo,
      isImage,
      imageSrc,
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
