<template>
  <v-snackbar color="secondary" v-model="open" location="right bottom" :timeout="4000" timer="primary">
    {{ message }}
    <template #actions>
      <v-btn variant="text" @click="close">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from "@/services";
import { computed } from "vue";

const snackbar = useSnackbarStore();

const close = () => {
  snackbar.clearMessage();
};

const message = computed(() => snackbar.message);

const open = computed<boolean>({
  get() {
    return !!snackbar.message;
  },
  set(open) {
    if (!open) {
      close();
    }
  },
});
</script>
