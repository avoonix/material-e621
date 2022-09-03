<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Appearance" color="darken-1 pink" />
        <settings-page-item title="Colors" select>
          <v-btn
            outlined
            block
            large
            color="primary"
            to="/settings/appearance/themes"
            class="mb-2"
          >
            Browse themes
          </v-btn>
          <color-chooser label="Primary" :color.sync="appearance.primaryColor" />
          <color-chooser label="Secondary" :color.sync="appearance.secondaryColor" />
          <color-chooser label="Accent" :color.sync="appearance.accentColor" />
          <color-chooser label="Background" :color.sync="appearance.backgroundColor" />
          <color-chooser label="Sidebar" :color.sync="appearance.sidebarColor" />
          <color-chooser label="Toolbar" :color.sync="appearance.toolbarColor" />
          <v-switch label="Dark" v-model="appearance.dark" />
        </settings-page-item>
        <settings-page-item
          title="Fullscreen image transitions"
          description="Change the image transitions"
          select
        >
          <v-select
            :items="transitionItems"
            outlined
            v-model="appearance.fullscreenTransition"
            hide-details
          />
          <transition-preview
            :transition-name="appearance.fullscreenTransition"
            :ratio="2"
            :directions="[
              'left',
              'right',
              'left',
              'right',
              'left',
              'left',
              'right',
              'right',
            ]"
            class="mt-3"
          />
        </settings-page-item>
        <settings-page-item
          title="Route transitions"
          description="Change the route transitions"
          select
        >
          <v-select
            :items="transitionItems"
            outlined
            v-model="appearance.routeTransition"
            hide-details
          />
          <transition-preview
            :transition-name="appearance.routeTransition"
            :ratio="2"
            :directions="['none', 'right', 'left', 'none']"
            class="mt-3"
          />
        </settings-page-item>
        <settings-page-item
          title="Colored stripe indicating post rating"
          switch
        >
          <v-switch v-model="appearance.ratingStripe" />
        </settings-page-item>
        <settings-page-item title="Navigation" select>
          <v-select
            :items="navigationTypeItems"
            outlined
            v-model="appearance.navigationType"
            hide-details
          />
        </settings-page-item>
        <settings-page-item title="Logo" select>
          <v-select
            :items="logoStyleItems"
            outlined
            v-model="appearance.logoStyle"
            hide-details
          />
        </settings-page-item>
        <settings-page-item title="Hide install prompt" switch>
          <v-switch v-model="appearance.hideInstallPrompt" />
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import TransitionPreview from "./TransitionPreview.vue";
import { computed, defineComponent } from "vue";
import ColorChooser from "./ColorChooser.vue";
import transitions from "@/misc/data/transitions.json";
import { useAppearanceStore } from "@/services";

export default defineComponent({
  metaInfo: {
    title: "Appearance Settings",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
    ColorChooser,
    TransitionPreview,
  },
  setup() {
    const appearance = useAppearanceStore();

    const transitionItems = computed(() =>
      Object.entries(transitions).map(([key, val]) => ({
        text: val.name,
        value: key,
      })),
    );
    return {
      transitionItems,
      appearance,
      navigationTypeItems: ["sidebar", "toolbar", "floating"],
      logoStyleItems: computed(() => appearance.logoStyles),
    };
  },
});
</script>
