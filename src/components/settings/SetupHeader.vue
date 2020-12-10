<template>
  <v-stepper-step
    :complete="parseInt(current) > parseInt(step)"
    :step="step"
    :color="parseInt(current) > parseInt(step) ? 'green' : 'primary'"
    editable
    edit-icon="mdi-check"
  >
    <span>
      {{ name }}
      <v-chip v-if="tutorial" label="" outline>Tutorial</v-chip>
    </span>
    <small v-if="description">{{ description }}</small>
  </v-stepper-step>
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
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    tutorial: {
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
