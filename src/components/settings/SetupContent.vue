<template>
  <v-stepper-content :step="step">
    <v-card class="mb-3 ma-2 text-xs-left elevation-4">
      <v-card-text style="min-height: 40px">
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          :to="{ path: '/settings', query: $store.state.routerModule.query }"
          exact
          >{{ last ? "finish" : "end setup" }}</v-btn
        >
        <!-- <v-btn flat color="primary" @click="current = step - 1" v-if="step != 1">Previous</v-btn> -->
        <v-btn
          flat
          color="primary"
          @click="current = parseInt(step) + 1"
          v-if="!last"
          >Next step</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-stepper-content>
</template>
<script>
export default {
  props: {
    step: {
      type: [Number, String],
    },
    value: {
      type: [Number, String],
    },
    last: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    current: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
