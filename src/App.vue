<template>
  <v-app>
    <v-navigation-drawer v-if="!minimalHeader" :color="theme.sidebar" :clipped="clipped" v-model="drawer" floating app
      width="400" class="pa-2">
      <router-link to="/">
        <app-logo v-view-transition-name="'applogo'" :type="logoStyle" />
      </router-link>
      <navigation-list />
      <portal-target name="sidebar-suggestions" />
    </v-navigation-drawer>
    <v-app-bar v-view-transition-name="'appbar'" :color="minimalHeader ? theme.primary : theme.toolbar"
      :app="!minimalHeader" :flat="minimalHeader" :clipped-left="clipped" :floating="navMode == 'floating'" :class="{
        'ma-2': navMode == 'floating',
        'mb-3': navMode == 'floating',
        primary: minimalHeader,
      }" class="padded-toolbar">
      <v-menu location="bottom right" offset-y close-delay="0" :nudge-width="200"
        v-if="navMode == 'floating' && !minimalHeader">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <navigation-list />
      </v-menu>
      <v-slide-x-transition>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-lg-and-up"
          v-if="navMode == 'sidebar' && !minimalHeader" />
      </v-slide-x-transition>
      <portal-target name="toolbar">
        <v-toolbar-title>{{ appName }}</v-toolbar-title>
      </portal-target>
      <v-spacer />
      <navigation-toolbar v-if="navMode === 'toolbar'" />
      <install-menu v-if="!minimalHeader" />
    </v-app-bar>
    <main-content />
    <app-snackbar />
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed, nextTick, onMounted, ref, watch } from "vue";
import AppLogo from "./App/AppLogo.vue";
import AppSnackbar from "./App/AppSnackbar.vue";
import InstallMenu from "./App/InstallMenu.vue";
import MainContent from "./App/MainContent.vue";
import NavigationList from "./App/NavigationList.vue";
import NavigationToolbar from "./App/NavigationToolbar.vue";
import { getAppName } from "./misc/util/utilities";
import { useAppearanceStore, useMainStore, usePersistanceService, useShortcutService, useShortcutStore } from "./services";
import { useHead } from '@unhead/vue';
import { useDisplay } from 'vuetify';
import { useSyncedTheme } from "./misc/util/syncTheme";

const persistance = usePersistanceService();
const appearance = useAppearanceStore();
const shortcuts = useShortcutStore();
const shortcutService = useShortcutService();
const navMode = computed(() => appearance.navigationType);
const theme = computed(() => appearance.theme);

useSyncedTheme();

onMounted(() => persistance.persist())

const logoStyle = computed(() => appearance.logoStyle);
const onLogoClick = () => {
  const availableStyles = appearance.logoStyles.filter(
    (ls) => ls !== logoStyle.value,
  );
  appearance.logoStyle =
    availableStyles[Math.floor(availableStyles.length * Math.random())];
};

const main = useMainStore();

main.$subscribe(() => {
  shortcutService.setUpShortcuts();
})
watch(main.shortcuts, () => console.log("shortcuts updated"))

useHead({
  title: getAppName(),
})

const { mobile } = useDisplay();

const route = useRoute();
const clipped = ref(false);
const drawer_ = ref(true);
const appName = getAppName();

const minimalHeader = computed(() => !!route.meta?.minimalHeader);

const drawer = computed({
  get: () =>
    Boolean(
      navMode.value == "sidebar" &&
      (drawer_.value || !mobile.value) &&
      !minimalHeader.value
    ),
  set: (val: boolean) => {
    drawer_.value = val;
  },
});

watch(mobile, (val, prevVal) => {
  if (navMode.value == "sidebar" && val) {
    drawer.value = false;
  }
  if (prevVal && !val) {
    nextTick(() => {
      drawer.value = false;
      nextTick(() => {
        drawer.value = true;
      });
    });
  }
});


</script>

<style lang="css">
@import "@/misc/styles/global.css";
</style>