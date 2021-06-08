<template>
  <div>
    <logo type="loader" />
    <span v-if="value">{{ value.message }} </span>
    <v-progress-linear
      v-if="value"
      :value="value.progress * 100"
      :indeterminate="value.indeterminate"
    />
  </div>
</template>

<script lang="ts">
import Logo from "@/App/Logo.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { Logo },
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
