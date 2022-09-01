<template>
  <v-snackbar color="secondary" v-model="open" right bottom :timeout="-1">
    {{ message }}
    <template #action="{ attrs }">
      <v-btn v-bind="attrs" text @click="close">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { snackbarService } from "@/services";
import { computed, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const close = () => {
      snackbarService.clearMessage();
    };

    const message = computed(() => snackbarService.message);

    const open = computed<boolean>({
      get() {
        return !!snackbarService.message;
      },
      set(open) {
        if (!open) {
          close();
        }
      },
    });

    return {
      message,
      close,
      open,
    };
  },
});
</script>
