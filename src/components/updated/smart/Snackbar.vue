<template>
  <v-snackbar v-model="open" right :timeout="0" top>
    {{ message }}
    <v-btn flat @click="close">Close</v-btn>
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
