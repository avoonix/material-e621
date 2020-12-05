<template>
  <div
    class="aspect-ratio-box"
    :style="{ 'padding-top': `calc(${1 / aspectRatio} * 100%)` }"
  >
    <transition name="blur">
      <img
        :is="!currentSrc ? 'div' : 'img'"
        class="aspect-ratio-box-inside"
        :key="currentSrc"
        :src="currentSrc"
        :class="{ blurry: preview === currentSrc }"
      />
    </transition>
  </div>
</template>

<script>
export default {
  props: ["src", "preview", "aspectRatio"],
  data: function() {
    return {
      currentSrc: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.startLoading();
    }, 3000);
  },

  methods: {
    startLoading() {
      const img = new Image(),
        img2 = new Image();

      img.onload = () => {
        if (this.currentSrc == this.src) return;
        this.currentSrc = this.preview;
      };
      img.src = this.preview;

      img2.onload = () => {
        setTimeout(() => {
          this.currentSrc = this.src;
        }, 3000);
      };
      img2.src = this.src;
    },
  },
};
</script>
<style lang="stylus" scoped>
.aspect-ratio-box {
  height: 0;
  overflow: hidden;
  position: relative;
}

.aspect-ratio-box-inside {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

// img, canvas, .placeholder {
// width: 100px;
// height: 100px;
// position: absolute;
// }

// .placeholder {
// background-color: rgba(0, 0, 0, 0.05);
// }
.blurry {
  filter: blur(10px);
}

.blur-enter-active, .blur-leave-active {
  transition: opacity 0.4s ease;
  opacity: 1;
}

.blur-enter, .blur-leave-active {
  opacity: 0;
}
</style>
