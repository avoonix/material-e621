<template>
  <v-menu bottom offset-y left attach close-delay="0">
    <template #activator="{ on }">
      <v-btn v-show="showInstallPrompt" v-on="on" icon>
        <v-badge color="primary" overlap left>
          <template #badge>
            <v-icon>mdi-exclamation-thick</v-icon>
          </template>
          <v-icon>mdi-download</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="400" color="secondary">
      <v-card-text>
        You are using a browser that supports installing progressive web apps.
        After installing, a shortcut will be added to your app drawer and the
        app will be launched as standalone window/app.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color @click="hide">Never show again</v-btn>
        <v-btn text color="primary" @click="install">Install</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { useAppearanceStore } from "@/services";
import { computed, defineComponent, ref } from "vue";

const deferredPrompt = ref<Event | null>(null);

window.addEventListener("beforeinstallprompt", (e: Event) => {
  e.preventDefault();
  deferredPrompt.value = e;
});

export default defineComponent({
  setup(props, context) {
    const appearance = useAppearanceStore();
    const showInstallPrompt = computed(
      () => !!deferredPrompt.value && !appearance.hideInstallPrompt,
    );

    const hide = () => {
      appearance.hideInstallPrompt = true;
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
