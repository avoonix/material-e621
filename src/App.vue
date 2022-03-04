<template>
  <v-app :class="`theme--${currentTheme.dark ? 'dark' : 'light'}`">
    <v-navigation-drawer
      persistent
      :clipped="clipped"
      v-model="drawer"
      fixed
      floating
      hide-overlay
      :temporary="isMobile"
      app
      width="400"
      class="pa-2"
      :style="`background-color: ${currentTheme.sidebar} !important; border-color: ${currentTheme.sidebar} !important;`"
    >
      <app-logo :type="logoStyle" @click.native="onLogoClick" />
      <navigation-list />
      <portal-target name="sidebar-suggestions" />
    </v-navigation-drawer>
    <v-app-bar
      :color="currentTheme.toolbar"
      :app="!minimalHeader"
      :flat="minimalHeader"
      :clipped-left="clipped"
      :floating="navMode == 'floating'"
      :class="{
        'ma-2': navMode == 'floating',
        'mb-3': navMode == 'floating',
        primary: minimalHeader,
      }"
      class="padded-toolbar"
    >
      <v-menu
        bottom
        offset-y
        right
        attach
        close-delay="0"
        :nudge-width="200"
        v-if="navMode == 'floating' && !minimalHeader"
      >
        <template #activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <navigation-list />
      </v-menu>
      <v-slide-x-transition>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          class="hidden-lg-and-up"
          v-if="navMode == 'sidebar' && !minimalHeader"
        />
      </v-slide-x-transition>
      <portal-target name="toolbar" style="width: 100%">
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

<script lang="ts">
import AppLogo from "./App/AppLogo.vue";
import { useSettingsServiceState, appearanceService } from "./services";
import { computed, defineComponent, watch } from "@vue/composition-api";
import NavigationList from "./App/NavigationList.vue";
import NavigationToolbar from "./App/NavigationToolbar.vue";
import MainContent from "./App/MainContent.vue";
import InstallMenu from "./App/InstallMenu.vue";
import { getAppName } from "./misc/util/utilities";
import AppSnackbar from "./App/AppSnackbar.vue";
import { shortcutService } from "./services/ShortcutService";

const mobileBreakPoint = 1264;

export default defineComponent({
  setup() {
    const { state } = useSettingsServiceState();

    const navMode = computed(() => appearanceService.navigationType);

    const logoStyle = computed(() => appearanceService.logoStyle);
    const onLogoClick = () => {
      const availableStyles = appearanceService.logoStyles.filter(
        (ls) => ls !== logoStyle.value,
      );
      appearanceService.logoStyle =
        availableStyles[Math.floor(availableStyles.length * Math.random())];
    };

    watch(
      shortcutService.shortcuts,
      () => {
        shortcutService.setUpShortcuts();
      },
      { immediate: true, deep: true },
    );

    return {
      state,
      navMode,
      logoStyle,
      onLogoClick,
    };
  },
  metaInfo() {
    return {
      title: "Welcome",
      titleTemplate: `${getAppName()} - %s`,
      meta: [
        {
          name: "description",
          content:
            "This is a client for e621 wich features different view modes, tag searching, infinite scrolling and more.",
        },
      ],
    };
  },
  components: {
    AppLogo,
    NavigationList,
    NavigationToolbar,
    MainContent,
    InstallMenu,
    AppSnackbar,
  },
  data() {
    return {
      clipped: false,
      drawer_: true,
      appName: getAppName(),
    };
  },
  computed: {
    minimalHeader() {
      return !!this.$route.meta?.minimalHeader;
    },
    isMobile() {
      return this.$vuetify.breakpoint.width < mobileBreakPoint;
    },
    drawer: {
      get() {
        return Boolean(
          this.navMode == "sidebar" &&
            (this.drawer_ || !this.isMobile) &&
            !this.minimalHeader,
        );
      },
      set(val) {
        this.drawer_ = val;
      },
    },
    currentTheme() {
      return {
        primary: appearanceService.primaryColor,
        secondary: appearanceService.secondaryColor,
        accent: appearanceService.accentColor,
        background: appearanceService.backgroundColor,
        sidebar: appearanceService.sidebarColor,
        toolbar: appearanceService.toolbarColor,
        dark: appearanceService.dark,
      };
    },
  },
  methods: {
    applyTheme() {
      this.$vuetify.theme.currentTheme.primary = this.currentTheme.primary;
      this.$vuetify.theme.currentTheme.secondary = this.currentTheme.secondary;
      this.$vuetify.theme.currentTheme.accent = this.currentTheme.accent;
      this.$vuetify.theme.dark = this.currentTheme.dark;
    },
  },
  async mounted() {
    this.applyTheme();
  },
  watch: {
    isMobile(val, prevVal) {
      if (this.navMode == "sidebar" && val) {
        this.drawer = false;
      }
      if (prevVal && !val) {
        this.$nextTick(() => {
          this.drawer = false;
          this.$nextTick(() => {
            this.drawer = true;
          });
        });
      }
    },
    currentTheme: {
      deep: true,
      immediate: true,
      handler() {
        this.applyTheme();
      },
    },
  },
});
</script>

<style lang="scss">
@import "@/misc/styles/animate.scss";
@import "@/misc/styles/global.scss";
</style>

<style scoped>
.padded-toolbar >>> .v-toolbar__content {
  /* padding-right: 4px;
  padding-left: 8px; */
}
</style>
