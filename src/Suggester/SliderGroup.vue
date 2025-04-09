<template>
  <v-row wrap>
    <v-col v-for="key in keys" :key="key" cols="12">
      <v-slider color="accent" class="mx-4" v-model="modelValue[key]" thumb-label :min="0" :max="100" :label="key" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed, nextTick, watch } from "vue";

const model = defineModel({
  type: Object,
  required: true,
  default: () => ({}),
});

const keys = computed(() => Object.keys(model.value));
</script>
