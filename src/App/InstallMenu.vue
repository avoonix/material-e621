<template>
  <v-menu bottom offset-y left attach close-delay="0">
    <v-btn v-show="showInstallPrompt" slot="activator" icon>
      <v-badge color="primary" overlap left>
        <template #badge>
          <v-icon>mdi-exclamation-thick</v-icon>
        </template>
        <v-icon>mdi-download</v-icon>
      </v-badge>
    </v-btn>
    <v-card max-width="400">
      <v-card-text>
        You are using a browser that supports installing progressive web apps.
        After installing, a shortcut will be added to your app drawer and the
        app will be launched as standalone window/app.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat color="" @click="hide"> Never show again </v-btn>
        <v-btn flat color="primary" @click="install"> Install </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { appearanceService } from "@/services";
import { computed, defineComponent, ref } from "@vue/composition-api";

const deferredPrompt = ref<Event | null>(null);

window.addEventListener("beforeinstallprompt", (e: Event) => {
  e.preventDefault();
  deferredPrompt.value = e;
});

export default defineComponent({
  setup(props, context) {
    const showInstallPrompt = computed(
      () => !!deferredPrompt.value && !appearanceService.hideInstallPrompt,
    );

    const hide = () => {
      appearanceService.hideInstallPrompt = true;
    };
    const install = async () => {
      if (!deferredPrompt.value) return;
      (deferredPrompt.value as any).prompt();
      const choiceResult = await (deferredPrompt.value as any).userChoice;
      if (choiceResult.outcome === "accepted") {
        // TODO
        console.log("User accepted the A2HS prompt");
        const granted = await navigator?.storage?.persist();
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt.value = null;
    };

    return {
      showInstallPrompt,
      hide,
      install,
    };
  },
});
</script>
