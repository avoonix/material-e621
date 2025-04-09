<template>
  <div class="d-flex align-center">
    <v-avatar class="ma-2" :color="currentColor">
      <v-icon>mdi-palette</v-icon>
    </v-avatar>
    <v-menu offset-y :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn color="primary" class="grow" variant="outlined" v-bind="props">
          {{ label }}
        </v-btn>
      </template>

      <v-color-picker elevation="16" hide-mode-switch v-model="currentColor" />
    </v-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const currentColor = computed<string>({
      get() {
        return props.color;
      },
      set(val) {
        context.emit("update:color", val);
      },
    });
    return {
      currentColor,
    };
  },
});
</script>
