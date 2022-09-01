<template>
  <div>
    <app-logo type="loader" />
    <span v-if="value">{{ value.message }} </span>
    <v-progress-linear
      v-if="value"
      :value="value.progress * 100"
      :indeterminate="value.indeterminate"
    />
  </div>
</template>

<script lang="ts">
import AppLogo from "@/App/AppLogo.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { AppLogo },
  props: {
    value: {
      type: Object,
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
