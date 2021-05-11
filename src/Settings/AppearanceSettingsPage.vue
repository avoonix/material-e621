<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Appearance" color="darken-1 pink" />
        <settings-page-item title="Primary color" select>
          <!-- description="The primary theme color" -->
          <color-chooser :color.sync="primary" />
        </settings-page-item>
        <settings-page-item title="Secondary color" select>
          <!-- description="The secondary theme color" -->
          <color-chooser :color.sync="secondary" />
        </settings-page-item>
        <settings-page-item title="Accent color" select>
          <!-- description="The accent theme color" -->
          <color-chooser :color.sync="accent" />
        </settings-page-item>
        <settings-page-item title="Dark" switch>
          <!-- description="The card and text color" -->
          <v-switch v-model="dark"></v-switch>
        </settings-page-item>
        <settings-page-item title="Background color" select>
          <!-- description="The background color" -->
          <color-chooser :color.sync="background" />
        </settings-page-item>
        <settings-page-item title="Sidebar color" select>
          <!-- description="The sidebar color" -->
          <color-chooser :color.sync="sidebar" />
        </settings-page-item>
        <settings-page-item
          title="Fullscreen image transitions"
          description="Change the image transitions"
          select
        >
          <v-select
            :items="transitionItems"
            box
            solo
            v-model="fullscreenTransition"
            hide-details
          />
          <transition-preview
            :transition-name="fullscreenTransition"
            :ratio="16 / 9"
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
            box
            solo
            v-model="routeTransition"
            hide-details
          />
          <transition-preview
            :transition-name="routeTransition"
            :ratio="16 / 12"
            :directions="['none', 'right', 'left', 'none']"
            class="mt-3"
          />
        </settings-page-item>
        <settings-page-item
          title="Colored stripe indicating post rating"
          switch
        >
          <v-switch v-model="stripe"></v-switch>
        </settings-page-item>
        <settings-page-item title="Navigation" select>
          <v-select
            :items="navigationTypeItems"
            box
            solo
            v-model="navigationType"
            hide-details
          />
        </settings-page-item>
        <settings-page-item title="Logo" select>
          <v-select
            :items="logoStyleItems"
            box
            solo
            v-model="logoStyle"
            hide-details
          />
        </settings-page-item>
        <settings-page-item title="Hide install prompt" switch>
          <v-switch v-model="hideInstallPrompt"></v-switch>
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import TransitionPreview from "./TransitionPreview.vue";
import { computed, defineComponent } from "@vue/composition-api";
import ColorChooser from "./ColorChooser.vue";
import { appearanceService } from "@/services";
import transitions from "@/misc/data/transitions.json";

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
    const transitionItems = computed(() =>
      Object.entries(transitions).map(([key, val]) => ({
        text: val.name,
        value: key,
      })),
    );
    return {
      transitionItems,
      primary: computed<string>({
        get() {
          return appearanceService.primaryColor;
        },
        set(value) {
          appearanceService.primaryColor = value;
        },
      }),
      secondary: computed<string>({
        get() {
          return appearanceService.secondaryColor;
        },
        set(value) {
          appearanceService.secondaryColor = value;
        },
      }),
      accent: computed<string>({
        get() {
          return appearanceService.accentColor;
        },
        set(value) {
          appearanceService.accentColor = value;
        },
      }),
      sidebar: computed<string>({
        get() {
          return appearanceService.sidebarColor;
        },
        set(value) {
          appearanceService.sidebarColor = value;
        },
      }),
      background: computed<string>({
        get() {
          return appearanceService.backgroundColor;
        },
        set(value) {
          appearanceService.backgroundColor = value;
        },
      }),
      dark: computed<boolean>({
        get() {
          return appearanceService.dark;
        },
        set(value) {
          appearanceService.dark = value;
        },
      }),
      fullscreenTransition: computed<string>({
        get() {
          return appearanceService.fullscreenTransition;
        },
        set(value) {
          appearanceService.fullscreenTransition = value;
        },
      }),
      routeTransition: computed<string>({
        get() {
          return appearanceService.routeTransition;
        },
        set(value) {
          appearanceService.routeTransition = value;
        },
      }),
      stripe: computed<boolean>({
        get() {
          return appearanceService.ratingStripe;
        },
        set(value) {
          appearanceService.ratingStripe = value;
        },
      }),
      navigationTypeItems: ["sidebar", "toolbar", "floating"],
      navigationType: computed<"sidebar" | "toolbar" | "floating">({
        get() {
          return appearanceService.navigationType;
        },
        set(value) {
          appearanceService.navigationType = value;
        },
      }),
      logoStyleItems: computed(() => appearanceService.logoStyles),
      logoStyle: computed<"face" | "text">({
        get() {
          return appearanceService.logoStyle;
        },
        set(value) {
          appearanceService.logoStyle = value;
        },
      }),
      hideInstallPrompt: computed<boolean>({
        get() {
          return appearanceService.hideInstallPrompt;
        },
        set(value) {
          appearanceService.hideInstallPrompt = value;
        },
      }),
    };
  },
});
</script>
