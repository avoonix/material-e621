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
        import(/* webpackChunkName: "misc" */ "@/Landing/LandingPage.vue"),
      meta: {
        minimalHeader: true,
      },
    },
    {
      path: "/posts",
      // alias: "/e621",
      name: "Posts",
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/Post/PostsPage.vue"),
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
        import(/* webpackChunkName: "settings" */ "@/Settings/ThemePage.vue"),
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
      path: "/settings/shortcuts",
      name: "ShortcutSettings",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "@/Settings/ShortcutSettingsPage.vue"
        ),
    },
    {
      path: "/parser",
      name: "Parser",
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/Parser/ParserTestPage.vue"),
    },
    {
      path: "/about",
      name: "About",
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/About/AboutPage.vue"),
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
          /* webpackChunkName: "analyzer" */ "@/Suggester/SuggesterInput.vue"
        ),
    },
    {
      path: "/suggester/result",
      name: "SuggesterResult",
      component: () =>
        import(
          /* webpackChunkName: "analyzer" */ "@/Suggester/SuggesterResult.vue"
        ),
    },
    {
      path: "/404",
      name: "ErrorPage",
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/Error/ErrorPage.vue"),
      alias: "*",
    },
    {
      alias: ["/favorites"],
      path: "/starred",
      name: "Starred",
      component: () =>
        import(/* webpackChunkName: "favorites" */ "@/Favorites/FavoritesPage.vue"),
    },
  ],
  mode: "hash",
});
