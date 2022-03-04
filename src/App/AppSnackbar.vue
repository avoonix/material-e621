<template>
  <v-snackbar color="secondary" v-model="open" right bottom :timeout="-1">
    {{ message }}
    <v-btn text @click="close">Close</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { snackbarService } from "@/services";
import { computed, defineComponent } from "@vue/composition-api";

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
