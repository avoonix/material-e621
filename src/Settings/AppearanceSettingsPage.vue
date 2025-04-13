<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
        <settings-page-title section="appearance" title="Appearance" color="pink-darken-1" />
        <settings-page-item title="Colors" select>
          <v-btn variant="outlined" block size="large" color="primary" to="/settings/appearance/themes" class="mb-2">
            Browse themes
          </v-btn>
          <color-chooser label="Primary" v-model:color="appearance.primaryColor" />
          <color-chooser label="Secondary" v-model:color="appearance.secondaryColor" />
          <color-chooser label="Accent" v-model:color="appearance.accentColor" />
          <color-chooser label="Background" v-model:color="appearance.backgroundColor" />
          <color-chooser label="Sidebar" v-model:color="appearance.sidebarColor" />
          <color-chooser label="Toolbar" v-model:color="appearance.toolbarColor" />
          <v-switch label="Dark" v-model="appearance.dark" />
        </settings-page-item>
        <settings-page-item title="Fullscreen image transitions" description="Change the image transitions" select>
          <v-select :items="transitionItems" variant="outlined" v-model="appearance.fullscreenTransition"
            hide-details />
          <transition-preview :transition-name="appearance.fullscreenTransition" :ratio="2" :directions="[
            'left',
            'right',
            'left',
            'right',
            'left',
            'left',
            'right',
            'right',
          ]" class="mt-3" />
        </settings-page-item>
        <!-- <settings-page-item title="Route transitions" description="Change the route transitions" select>
          <v-select :items="transitionItems" variant="outlined" v-model="appearance.routeTransition" hide-details />
          <transition-preview :transition-name="appearance.routeTransition" :ratio="2"
            :directions="['none', 'right', 'left', 'none']" class="mt-3" />
        </settings-page-item> -->
        <settings-page-item title="Colored stripe indicating post rating" switch>
          <v-switch v-model="appearance.ratingStripe" />
        </settings-page-item>
        <settings-page-item title="Navigation" select>
          <v-select :items="navigationTypeItems" variant="outlined" v-model="appearance.navigationType" hide-details />
        </settings-page-item>
        <settings-page-item title="Logo" select>
          <v-select :items="logoStyleItems" variant="outlined" v-model="appearance.logoStyle" hide-details />
        </settings-page-item>
        <settings-page-item title="Hide install prompt" switch>
          <v-switch v-model="appearance.hideInstallPrompt" />
        </settings-page-item>
        <settings-page-item title="Hide GitHub info" switch>
          <v-switch v-model="appearance.hideGithubInfo" />
        </settings-page-item>
        <settings-page-item title="Hide Migration info" switch>
          <v-switch v-model="appearance.hideMigrationInfo" />
        </settings-page-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import TransitionPreview from "./TransitionPreview.vue";
import { computed, defineComponent } from "vue";
import ColorChooser from "./ColorChooser.vue";
import transitions from "@/misc/data/transitions.json";
import { useAppearanceStore } from "@/services";
import { useHead } from "@unhead/vue";

useHead({
  title: "Appearance Settings",
});

const appearance = useAppearanceStore();

const transitionItems = computed(() =>
  Object.entries(transitions).map(([key, val]) => ({
    title: val.name,
    value: key,
  })),
);

const navigationTypeItems = ["sidebar", "toolbar", "floating"];
const logoStyleItems = computed(() => appearance.logoStyles)
</script>
