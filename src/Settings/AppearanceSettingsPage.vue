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
          <color-chooser label="Primary" :color.sync="primary" />
          <color-chooser label="Secondary" :color.sync="secondary" />
          <color-chooser label="Accent" :color.sync="accent" />
          <color-chooser label="Background" :color.sync="background" />
          <color-chooser label="Sidebar" :color.sync="sidebar" />
          <color-chooser label="Toolbar" :color.sync="toolbar" />
          <v-switch label="Dark" v-model="dark" />
        </settings-page-item>
        <settings-page-item
          title="Fullscreen image transitions"
          description="Change the image transitions"
          select
        >
          <v-select
            :items="transitionItems"
            outlined
            v-model="fullscreenTransition"
            hide-details
          />
          <transition-preview
            :transition-name="fullscreenTransition"
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
            v-model="routeTransition"
            hide-details
          />
          <transition-preview
            :transition-name="routeTransition"
            :ratio="2"
            :directions="['none', 'right', 'left', 'none']"
            class="mt-3"
          />
        </settings-page-item>
        <settings-page-item
          title="Colored stripe indicating post rating"
          switch
        >
          <v-switch v-model="stripe" />
        </settings-page-item>
        <settings-page-item title="Navigation" select>
          <v-select
            :items="navigationTypeItems"
            outlined
            v-model="navigationType"
            hide-details
          />
        </settings-page-item>
        <settings-page-item title="Logo" select>
          <v-select
            :items="logoStyleItems"
            outlined
            v-model="logoStyle"
            hide-details
          />
        </settings-page-item>
        <settings-page-item title="Hide install prompt" switch>
          <v-switch v-model="hideInstallPrompt" />
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
      toolbar: computed<string>({
        get() {
          return appearanceService.toolbarColor;
        },
        set(value) {
          appearanceService.toolbarColor = value;
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
