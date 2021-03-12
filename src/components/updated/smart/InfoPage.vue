<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 md8 offset-md2>
        <settings-page-title title="Info" color="darken-2 teal" />
        <settings-page-item
          :title="`Storage used: ${usageStr}`"
          description="Shows the storage used for cached files, settings and cached tags."
          select
        >
          <v-progress-linear
            color="accent"
            class="ma-1"
            indeterminante
            :value="usagePercentage"
          />
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "../dumb/SettingsPageTitle.vue";
import SettingsPageItem from "../dumb/SettingsPageItem.vue";
import { computed, defineComponent, reactive } from "@vue/composition-api";
import prettyBytes from "pretty-bytes";

export default defineComponent({
  metaInfo: {
    title: "Info",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
  },
  setup() {
    const storage = reactive({
      used: 0,
      total: 0,
    });
    const usageStr = computed(
      () => `${prettyBytes(storage.used)} / ${prettyBytes(storage.total)}`,
    );
    const usagePercentage = computed(
      () => (storage.used / (storage.total || 1)) * 100,
    );
    navigator.storage.estimate().then((estimate) => {
      storage.used = estimate.usage || 0;
      storage.total = estimate.quota || 0;
    });
    return {
      usageStr,
      usagePercentage,
    };
  },
});
</script>
