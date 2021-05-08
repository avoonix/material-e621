<template>
  <v-app :dark="isDark" :class="`theme--${isDark ? 'dark' : 'light'}`">
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
      <logo :type="logoStyle" @click.native="onLogoClick" />
      <navigation-list />
      <portal-target name="sidebar-suggestions"></portal-target>
    </v-navigation-drawer>
    <v-toolbar
      :app="!$route.meta.minimalHeader"
      :flat="$route.meta.minimalHeader"
      :clipped-left="clipped"
      :floating="navMode == 'floating'"
      :class="{
        'ma-2': navMode == 'floating',
        'mb-3': navMode == 'floating',
        primary: $route.meta.minimalHeader,
      }"
    >
      <v-menu
        bottom
        offset-y
        right
        attach
        close-delay="0"
        :nudge-width="200"
        v-if="navMode == 'floating' && !$route.meta.minimalHeader"
      >
        <v-btn slot="activator" icon>
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <navigation-list />
      </v-menu>
      <v-slide-x-transition>
        <v-toolbar-side-icon
          @click.stop="drawer = !drawer"
          class="hidden-lg-and-up"
          v-if="navMode == 'sidebar' && !$route.meta.minimalHeader"
        ></v-toolbar-side-icon>
      </v-slide-x-transition>
      <v-toolbar-title v-if="navMode != 'floating' || $route.path != '/e621'">
        {{ appName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <navigation-toolbar v-if="navMode === 'toolbar'" />
      <account-menu />
    </v-toolbar>
    <main-content />
    <snackbar />
  </v-app>
</template>

<script lang="ts">
import Snackbar from "./App/Snackbar.vue";
import Logo from "./components/updated/dumb/Logo.vue";
import { useSettingsServiceState, appearanceService } from "./services";
import AccountMenu from "./App/AccountMenu.vue";
import { computed, defineComponent } from "@vue/composition-api";
import NavigationList from "./App/NavigationList.vue";
import NavigationToolbar from "./App/NavigationToolbar.vue";
import MainContent from "./App/MainContent.vue";
import { getAppName } from "./utilities/utilities";

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

    return {
      state,
      navMode,
      logoStyle,
      onLogoClick,
    };
  },
  metaInfo() {
    return {
      title: "Landing Page",
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
    Logo,
    Snackbar,
    AccountMenu,
    NavigationList,
    NavigationToolbar,
    MainContent,
  },
  data() {
    return {
      clipped: false,
      drawer_: true,
      appName: getAppName(),
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < parseInt(mobileBreakPoint, 10);
    },
    drawer: {
      get() {
        return (
          this.navMode == "sidebar" &&
          (this.drawer_ || !this.isMobile) &&
          !this.$route.meta.minimalHeader
        );
      },
      set(val) {
        this.drawer_ = val;
      },
    },
    isDark() {
      return appearanceService.dark;
    },
    currentTheme() {
      return {
        primary: appearanceService.primaryColor,
        secondary: appearanceService.secondaryColor,
        accent: appearanceService.accentColor,
        background: appearanceService.backgroundColor,
        sidebar: appearanceService.sidebarColor,
      };
    },
  },
  methods: {
    applyTheme() {
      this.$vuetify.theme.primary = this.currentTheme.primary;
      this.$vuetify.theme.secondary = this.currentTheme.secondary;
      this.$vuetify.theme.accent = this.currentTheme.accent;
    },
  },
  async mounted() {
    this.applyTheme();
  },
  watch: {
    isDark: {
      immediate: true,
      handler(val) {
        if (val) {
          if (document.body.className.indexOf("scrollbar-color-dark") < 0)
            document.body.className += "scrollbar-color-dark";
        } else {
          document.body.className = document.body.className.replace(
            "scrollbar-color-dark",
            "",
          );
        }
      },
    },
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
@import "./shared/styles/animate.scss";
@import "./shared/styles/global.scss";
</style>
