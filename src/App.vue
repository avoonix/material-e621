<template>
  <v-app :class="`theme--${theme.dark ? 'dark' : 'light'}`">
    <v-navigation-drawer persistent :clipped="clipped" v-model="drawer" fixed floating hide-overlay
      :temporary="isMobile" app width="400" class="pa-2"
      :style="`background-color: ${theme.sidebar} !important; border-color: ${theme.sidebar} !important;`">
      <router-link to="/">
        <app-logo :type="logoStyle" />
      </router-link>
      <navigation-list />
      <portal-target name="sidebar-suggestions" />
    </v-navigation-drawer>
    <v-app-bar :color="theme.toolbar" :app="!minimalHeader" :flat="minimalHeader" :clipped-left="clipped"
      :floating="navMode == 'floating'" :class="{
  'ma-2': navMode == 'floating',
  'mb-3': navMode == 'floating',
  primary: minimalHeader,
}" class="padded-toolbar">
      <v-menu bottom offset-y right attach close-delay="0" :nudge-width="200"
        v-if="navMode == 'floating' && !minimalHeader">
        <template #activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <navigation-list />
      </v-menu>
      <v-slide-x-transition>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-lg-and-up"
          v-if="navMode == 'sidebar' && !minimalHeader" />
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
import { computed, defineComponent, onMounted, watch } from "vue";
import AppLogo from "./App/AppLogo.vue";
import AppSnackbar from "./App/AppSnackbar.vue";
import InstallMenu from "./App/InstallMenu.vue";
import MainContent from "./App/MainContent.vue";
import NavigationList from "./App/NavigationList.vue";
import NavigationToolbar from "./App/NavigationToolbar.vue";
import { getAppName } from "./misc/util/utilities";
import { useAppearanceStore, useMainStore, usePersistanceService, useShortcutService, useShortcutStore } from "./services";

const mobileBreakPoint = 1264;

export default defineComponent({
  setup() {
    const persistance = usePersistanceService();
    const appearance = useAppearanceStore();
    const shortcuts = useShortcutStore();
    const shortcutService = useShortcutService();
    const navMode = computed(() => appearance.navigationType);

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

    const theme = computed(() => appearance.theme);

    return {
      navMode,
      logoStyle,
      onLogoClick,
      theme,
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
      set(val: boolean) {
        this.drawer_ = val;
      },
    },
  },
  methods: {
    applyTheme() {
      this.$vuetify.theme.themes.dark.primary = this.theme.primary;
      this.$vuetify.theme.themes.light.primary = this.theme.primary;
      this.$vuetify.theme.themes.dark.secondary = this.theme.secondary;
      this.$vuetify.theme.themes.light.secondary = this.theme.secondary;
      this.$vuetify.theme.themes.dark.accent = this.theme.accent;
      this.$vuetify.theme.themes.light.accent = this.theme.accent;
      this.$vuetify.theme.dark = this.theme.dark;
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
    theme: {
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
.padded-toolbar :deep(.v-toolbar__content) {
  /* padding-right: 4px;
  padding-left: 8px; */
}
</style>
