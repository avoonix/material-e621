import Vue from "vue";
import Router from "vue-router";

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
          /* webpackChunkName: "landing-page" */ "@/Landing/LandingPage.vue"
        ),
      meta: {
        minimalHeader: true,
      },
    },
    {
      path: "/posts",
      // alias: "/e621",
      name: "Posts",
      component: () =>
        // TODO: uncomment once complete
        import(/* webpackChunkName: "posts" */ "@/Post/PostsPage.vue"),
    },
    {
      path: "/settings",
      name: "Settings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/SettingsPage.vue"
        ),
    },
    {
      path: "/settings/account",
      name: "AccountSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/AccountSettingsPage.vue"
        ),
    },
    {
      path: "/settings/posts",
      name: "PostSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/PostSettingsPage.vue"
        ),
    },
    {
      path: "/settings/blacklist",
      name: "BlacklistSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/BlacklistSettingsPage.vue"
        ),
    },
    {
      path: "/settings/appearance",
      name: "AppearanceSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/AppearanceSettingsPage.vue"
        ),
    },
    {
      path: "/settings/appearance/themes",
      name: "Themes",
      component: () =>
        import(/* webpackChunkName: "themes" */ "@/Settings/ThemePage.vue"),
    },
    {
      path: "/settings/history",
      name: "HistorySettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/HistorySettingsPage.vue"
        ),
    },
    {
      path: "/settings/restore",
      name: "RestoreSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/RestoreSettingsPage.vue"
        ),
    },
    {
      path: "/settings/info",
      name: "Infos",
      component: () =>
        import(/* webpackChunkName: "settings" */ "@/Settings/InfoPage.vue"),
    },
    {
      path: "/parser",
      name: "Parser",
      component: () =>
        import(/* webpackChunkName: "parser" */ "@/Parser/ParserTestPage.vue"),
    },
    {
      path: "/about",
      name: "About",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/About/AboutPage.vue"),
    },
    {
      path: "/analyzer",
      name: "FavoritesAnalyzer",
      component: () =>
        import(
          /* webpackChunkName: "analyzer" */ "@/Analyzer/FavoritesAnalyzer.vue"
        ),
    },
    {
      path: "/analyzer/result",
      name: "FavoritesAnalyzerResult",
      component: () =>
        import(
          /* webpackChunkName: "analyzer" */ "@/Analyzer/FavoritesAnalyzerResult.vue"
        ) as any,
    },
    {
      path: "/suggester",
      name: "Suggester",
      component: () =>
        import(
          /* webpackChunkName: "suggester" */ "@/Suggester/SuggesterInput.vue"
        ),
    },
    {
      path: "/suggester/result",
      name: "SuggesterResult",
      component: () =>
        import(
          /* webpackChunkName: "suggester" */ "@/Suggester/SuggesterResult.vue"
        ),
    },
    {
      path: "/404",
      name: "ErrorPage",
      component: () =>
        import(/* webpackChunkName: "error" */ "@/Error/ErrorPage.vue"),
      alias: "*",
    },
  ],
  mode: "hash",
});
