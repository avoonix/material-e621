import Vue from "vue";
import Router from "vue-router";
import Install from "@/components/Install.vue";

// workaround for errors in console
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err);
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: () =>
        import(
          /* webpackChunkName: "landing-page" */ "@/components/views/LandingPage.vue"
        ),
      meta: {
        minimalHeader: true,
      },
    },
    {
      path: "/e621",
      name: "Posts",
      component: () =>
        // TODO: uncomment once completed
        import(
          /* webpackChunkName: "posts" */ "@/components/views/PostsPage.vue"
        ),
      // import ("@/components/Posts")
    },
    {
      path: "/settings",
      name: "Settings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/components/updated/dumb/SettingsPage.vue"
        ),
    },
    {
      path: "/settings/blacklist",
      name: "BlacklistSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/components/updated/smart/BlacklistSettingsPage.vue"
        ),
    },
    {
      path: "/settings/appearance",
      name: "AppearanceSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/components/updated/smart/AppearanceSettingsPage.vue"
        ),
    },
    {
      path: "/settings/history",
      name: "HistorySettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/components/updated/smart/HistorySettingsPage.vue"
        ),
    },
    {
      path: "/settings/restore",
      name: "RestoreSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/components/updated/smart/RestoreSettingsPage.vue"
        ),
    },
    // {
    //   path: "/settings/setup/:step",
    //   name: "SettingsSetup",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "settings" */ "@/components/settings/SettingsPage.vue"
    //     ),
    // },
    {
      path: "/parser",
      name: "Parser",
      component: () =>
        import(
          /* webpackChunkName: "parser" */ "@/components/views/ParserTestPage.vue"
        ),
    },
    {
      path: "/suggester",
      name: "PostSuggester",
      component: () =>
        import(
          /* webpackChunkName: "suggester" */ "@/components/PostSuggester.vue"
        ),
    },
    {
      path: "/install",
      name: "Install",
      component: Install,
    },
    {
      path: "/about",
      name: "About",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "@/components/views/AboutPage.vue"
        ),
    },
    {
      path: "/404",
      name: "ErrorPage",
      component: () =>
        import(
          /* webpackChunkName: "error" */ "@/components/updated/dumb/ErrorPage.vue"
        ),
      alias: "*",
    },
  ],
  mode: "hash",
});
