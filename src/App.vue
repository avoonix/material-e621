<template>
  <v-app :dark="isDark" :class="`theme--${backgroundColor}`">
    <template>
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
        class="pa-2 sidenav-color"
        :style="
          `background-color: ${currentTheme.sidebar} !important; border-color: ${currentTheme.sidebar} !important;`
        "
      >
        <logo />
        <navigation
          type="sidebar"
          :post-count="postCount"
          :blacklist-count="blacklistCount"
          :blacklist-open.sync="blacklistOpen"
          :nav-mode="navMode"
        />
        <portal-target name="sidebar-suggestions"></portal-target>
      </v-navigation-drawer>
      <v-toolbar
        :app="!$route.meta.minimalHeader"
        :flat="$route.meta.minimalHeader"
        :clipped-left="clipped"
        :floating="navMode == 'im'"
        :class="{
          'ma-2': navMode == 'im',
          'mb-3': navMode == 'im',
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
          v-if="navMode == 'im' && !$route.meta.minimalHeader"
        >
          <v-btn slot="activator" icon>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <navigation
            type="dropdown"
            :post-count="postCount"
            :blacklist-count="blacklistCount"
            :blacklist-open.sync="blacklistOpen"
            :nav-mode="navMode"
          />
        </v-menu>
        <v-slide-x-transition>
          <v-toolbar-side-icon
            @click.stop="drawer = !drawer"
            class="hidden-lg-and-up"
            v-if="navMode == 'sidebar' && !$route.meta.minimalHeader"
          ></v-toolbar-side-icon>
        </v-slide-x-transition>
        <v-toolbar-title v-if="navMode != 'im' || $route.path != '/e621'">
          {{ $appName }}
        </v-toolbar-title>
        <tag-search
          class="ma-2 pt-2"
          v-if="$route.path == '/e621' && navMode == 'im'"
        />
        <v-spacer></v-spacer>
        <navigation
          type="toolbar"
          :post-count="postCount"
          :blacklist-count="blacklistCount"
          :blacklist-open.sync="blacklistOpen"
          :nav-mode="navMode"
          v-if="!$route.meta.minimalHeader"
        />
        <login-dialog v-if="!$route.meta.minimalHeader" />
      </v-toolbar>
      <navigation
        type="bottom"
        :post-count="postCount"
        :blacklist-count="blacklistCount"
        :blacklist-open.sync="blacklistOpen"
        :nav-mode="$route.meta.minimalHeader ? '' : navMode"
      />
      <v-content
        class="main-content-color"
        :style="
          `background-color: ${currentTheme.background} !important; border-color: ${currentTheme.background} !important;`
        "
      >
        <error-alert />
        <transition
          v-if="!isPrerender"
          :enter-active-class="enterTransitionName"
          :leave-active-class="leaveTransitionName"
          mode="out-in"
        >
          <router-view :key="routeKey" />
        </transition>
        <first-visit-dialog />
        <blacklist-dialog v-model="blacklistOpen" />
        <download-dialog />
        <posts-dialog />
        <update-dialog />
        <snackbar />
      </v-content>
    </template>
  </v-app>
</template>

<script>
import TagSearch from "./components/TagSearch.vue";
import BlacklistDialog from "./components/dialogs/BlacklistDialog.vue";
import Snackbar from "./components/Snackbar.vue";
import Logo from "./components/Logo.vue";
import LoginDialog from "./components/dialogs/LoginDialog.vue";
import Navigation from "./components/Navigation.vue";
import PostsDialog from "./components/dialogs/PostsDialog.vue";
import UpdateDialog from "./components/dialogs/UpdateDialog.vue";
import FirstVisitDialog from "./components/dialogs/FirstVisitDialog.vue";
import DownloadDialog from "./components/dialogs/DownloadDialog.vue";
import ErrorAlert from "./components/ErrorAlert.vue";
import { ACTIONS, GETTERS } from "./store/constants";
import { getTransitionName } from "./utilities";

const mobileBreakPoint = 1264;

export default {
  metaInfo() {
    return {
      title: "loading",
      titleTemplate: `${this.$appName} - %s`,
      link: [
        { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
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
    FirstVisitDialog,
    LoginDialog,
    Logo,
    Snackbar,
    DownloadDialog,
    PostsDialog,
    UpdateDialog,
    Navigation,
    BlacklistDialog,
    TagSearch,
    ErrorAlert,
  },
  data() {
    return {
      clipped: false,
      enterTransitionName: "fade",
      leaveTransitionName: "fade",
      drawer_: true,
      blacklistOpen: false,
    };
  },
  created() {
    this.debugTimer = Date.now();
  },
  computed: {
    transitionName() {
      return this.$store.getters[GETTERS.ROUTE_TRANSITION];
    },
    isPrerender() {
      return !!(
        window.__SPECIAL_OPTIONS && window.__SPECIAL_OPTIONS.isPrerender
      );
    },
    routeKey() {
      if ((this.$route.path || "").startsWith("/settings/setup/"))
        return "/settings/setup/"; // no transition between steps
      return this.$route.path;
    },
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
    navMode() {
      return this.$store.getters[GETTERS.NAVIGATION_TYPE];
    },
    blacklistCount() {
      return this.$store.getters[GETTERS.GET_BLACKLIST_ARRAY].length;
    },
    postCount() {
      return this.$store.getters[GETTERS.GET_VISIBLE_POSTS].length;
    },
    isDark() {
      return (this.$store.getters[GETTERS.BACKGROUND_COLOR] || "").startsWith(
        "dark",
      );
    },
    backgroundColor() {
      return this.$store.getters[GETTERS.BACKGROUND_COLOR];
    },
    currentTheme() {
      return this.$store.getters[GETTERS.CUSTOM_COLORS];
    },
  },
  methods: {
    applyTheme() {
      this.$vuetify.theme.primary = this.currentTheme.primary;
      this.$vuetify.theme.secondary = this.currentTheme.secondary;
      this.$vuetify.theme.accent = this.currentTheme.accent;
    },
  },
  beforeCreate() {
    this.$restoreSettings();
  },
  async mounted() {
    this.applyTheme();
    this.$store.dispatch(ACTIONS.LOG_IN);
    await this.$nextTick();

    // renderAfterDocumentEvent (prerendering)
    document.dispatchEvent(new Event("render-event"));
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
    // You'll need this for renderAfterDocumentEvent.
    // document.dispatchEvent(new Event("render-event"));
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      const { enterTransitionName, leaveTransitionName } = getTransitionName(
        this.transitionName,
        toDepth < fromDepth ? "left" : toDepth == fromDepth ? "none" : "right",
      );
      this.enterTransitionName = enterTransitionName;
      this.leaveTransitionName = leaveTransitionName;
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
    "$store.state.routerModule.query"() {
      this.$saveSettings();
    },
    "$store.state.favoritedPosts"() {
      this.$saveSettings();
    },
    backgroundColor() {
      this.applyTheme();
    },
  },
  name: "App",
};
</script>

<style lang="scss">
@import "./styles/animate.scss";
</style>

<style>
body {
  user-select: initial !important;
  background-color: #808080;
}

html {
  overflow-y: scroll !important;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #e0e0e0;
}

.scrollbar-color-dark::-webkit-scrollbar-track,
.scrollbar-color-dark ::-webkit-scrollbar-track {
  background: #313131;
}

::-webkit-scrollbar-thumb {
  background: #9c9c9c;
}

.scrollbar-color-dark::-webkit-scrollbar-thumb,
.scrollbar-color-dark ::-webkit-scrollbar-thumb {
  background: #484848;
}

::-webkit-scrollbar-thumb:hover {
  background: #5c5c5c;
}

.scrollbar-color-dark::-webkit-scrollbar-thumb:hover,
.scrollbar-color-dark ::-webkit-scrollbar-thumb:hover {
  background: #838383;
}
</style>