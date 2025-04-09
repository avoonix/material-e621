<template>
  <div>
    <div class="ma-2">
      <v-btn variant="outlined" block size="large" color="primary" to="/settings/appearance" exact>
        <v-icon start>mdi-arrow-left</v-icon>
        Back
      </v-btn>
    </div>
    <v-container>
      <v-row align="center">
        <v-col cols="12" sm="6" md="4" lg="3" :key="idx" v-for="(theme, idx) in themes">
          <theme-preview @apply-theme="applyTheme(theme)" :theme="theme" />
        </v-col>
      </v-row>
    </v-container>
    <div class="ma-2">
      <v-btn variant="outlined" block size="large" color="primary" :href="issueUrl" target="_blank">
        <v-icon start>mdi-open-in-new</v-icon>
        Want your theme listed?
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from "vue";
import type { Theme } from "@/services";
import { useAppearanceStore } from "@/services";
import themes from "@/misc/data/themes.json";
import ThemePreview from "./ThemePreview.vue";
import { createIssueLink } from "@/misc/util/git";
import { useHead } from "@unhead/vue";

useHead({ title: "Themes", });

const appearance = useAppearanceStore();

const applyTheme = (theme: Theme) => {
  appearance.applyTheme(theme);
};
const issueUrl = computed(() =>
  createIssueLink({
    title: "New theme: <your theme name here>",
    body: `Hi, I would like to propose adding a new theme:

\`\`\`json
${JSON.stringify(appearance.theme, null, 2)}
\`\`\`
`,
  }),
);
</script>
