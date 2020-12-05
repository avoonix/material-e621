<template>
  <v-snackbar
    v-model="snackbar"
    right
    :timeout="0"
    top
    v-if="!$store.state.zip.loading"
  >
    {{ text }}
    <v-btn flat @click="snackbar = false">Close</v-btn>
  </v-snackbar>
  <v-snackbar :timeout="0" bottom left v-else vertical multi-line :value="true">
    <div style="max-height: 70vh; overflow-y: auto; ">
      <div v-if="extendedProgress">
        <v-progress-linear
          v-for="progress in [...$store.state.zip.progressArr]
            .map((a, i) => ({ key: i, value: a }))
            .filter((a) => a.value > 0 && a.value < 100)
            .sort((a, b) => b.value - a.value)"
          :key="progress.key"
          :value="progress.value"
          color="accent"
        ></v-progress-linear>
      </div>
      <v-progress-linear
        :value="overallProgress"
        :class="{ 'mt-0': !extendedProgress }"
      ></v-progress-linear>
    </div>
    <v-card class="transparent elevation-0">
      <div v-if="overallProgress != 100">
        Downloaded {{ finishedPosts }} of {{ totalPosts }} ({{
          overallProgress
        }}%)
      </div>
      <div v-else>
        Zipping {{ totalPosts }} files ({{
          ($store.state.zip.rawAllByteSize / 1e6).toFixed(2)
        }}
        MB)
      </div>
      <div v-if="overallProgress != 100">
        {{ ($store.state.zip.rawAllByteSize / 1e6).toFixed(2) }} MB unzipped
      </div>
      <div v-if="!isFinite($store.state.zip.timeRemaining)">
        Calculating remaining time
      </div>
      <div v-else-if="$store.state.zip.timeRemaining >= 5">
        {{ $store.state.zip.bitrate }} - about
        {{ $store.state.zip.timeRemaining }} seconds remaining
      </div>
      <div v-else>Almost done!</div>
    </v-card>
  </v-snackbar>
</template>
<script>
import { GETTERS, ACTIONS } from "../store/constants";
import scrollIntoView from "scroll-into-view";

export default {
  computed: {
    extendedProgress() {
      return this.$store.getters[GETTERS.IS_DOWNLOAD_PROGRESS];
    },
    overallProgress() {
      // returns value between 0 and 100
      if (this.$store.state.zip.progressArr.length) {
        return (
          this.$store.state.zip.progressArr.reduce((prev, cur) => prev + cur) /
          this.$store.state.zip.progressArr.length
        ).toFixed(2);
      }
      return 0;
    },
    finishedPosts() {
      if (this.$store.state.zip.progressArr.length) {
        return this.$store.state.zip.progressArr.reduce(
          (prev, cur) => (cur == 100 ? prev + 1 : prev),
          0,
        );
      }
      return 0;
    },
    totalPosts() {
      return this.$store.state.zip.progressArr.length;
    },
    text() {
      return this.$store.getters[GETTERS.GET_FIRST_MESSAGE].text;
    },
    snackbar: {
      get() {
        return !!this.$store.getters[GETTERS.GET_FIRST_MESSAGE];
      },
      set(val) {
        this.$store.dispatch(ACTIONS.REMOVE_FIRST_MESSAGE);
      },
    },
  },
};
</script>

<style lang="stylus">
.v-snack__wrapper {
  height: initial;
}

.v-snack__content {
  height: initial !important;
}
</style>
