<template>
  <a
    :is="component"
    :href="href"
    v-on="$listeners"
    v-bind="$attrs"
    target="_blank"
    class="accent--text"
    rel="noopener"
  >
    <slot>{{ href }}</slot>
  </a>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // disabled: {
    //   type: Boolean,
    //   default: false,
    // },
    href: {
      type: String,
      default: "",
    },
    component: {
      type: String,
      default: "a",
    },
  },
};
</script>
