<template>
  <div>
    <div class="ma-2">
      <v-btn
        outline
        block
        large
        color="primary"
        to="/settings/appearance"
        exact
      >
        <v-icon left>mdi-arrow-left</v-icon>
        Back
      </v-btn>
    </div>
    <v-container fill-height>
      <v-layout align-center row wrap>
        <v-flex xs12 sm6 md4 lg3 :key="idx" v-for="(theme, idx) in themes">
          <theme-preview @apply-theme="applyTheme(theme)" :theme="theme" />
        </v-flex>
      </v-layout>
    </v-container>
    <div class="ma-2">
      <v-btn
        outline
        block
        large
        color="primary"
        :href="issueUrl"
        target="_blank"
      >
        <v-icon left>mdi-open-in-new</v-icon>
        Want your theme listed?
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { appearanceService, Theme } from "@/services";
import themes from "@/misc/data/themes.json";
import ThemePreview from "./ThemePreview.vue";
import { createIssueLink } from "@/misc/util/git";

export default defineComponent({
  metaInfo: {
    title: "Themes",
  },
  components: {
    ThemePreview,
  },
  setup() {
    const applyTheme = (theme: Theme) => {
      appearanceService.applyTheme(theme);
    };
    const issueUrl = computed(() =>
      createIssueLink({
        title: "New theme: <your theme name here>",
        body: `Hi, I would like to propose adding a new theme:

\`\`\`json
${JSON.stringify(appearanceService.theme, null, 2)}
\`\`\`
`,
      }),
    );
    return {
      applyTheme,
      themes,
      issueUrl,
    };
  },
});
</script>
