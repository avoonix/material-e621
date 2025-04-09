import { createRouter, createWebHashHistory } from 'vue-router'

// TODO?
// // workaround for errors in console
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location: any) {
//   return (originalPush.call(this, location) as any).catch((err: any) => err);
// };



const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // routes: [
  //   {
  //     path: '/',
  //     name: 'home',
  //     component: HomeView,
  //   },
  //   {
  //     path: '/about',
  //     name: 'about',
  //     // route level code-splitting
  //     // this generates a separate chunk (About.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import('../views/AboutView.vue'),
  //   },
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
      path: "/dash",
      name: "Dashboard",
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ "@/ArtistDashboard/Dashboard.vue"
        ),
    },
    {
      path: "/dash/:name",
      name: "DashboardResult",
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ "@/ArtistDashboard/DashboardResult.vue"
        ),
    },
    {
      alias: ["/favorites"],
      path: "/starred",
      name: "Starred",
      component: () =>
        import(/* webpackChunkName: "favorites" */ "@/Favorites/FavoritesPage.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "ErrorPage",
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/Error/ErrorPage.vue"),
    },
  ],
})

router.beforeResolve(async (to, from) => {
  if (from.name === to.name) {
    return true;
  }
  const viewTransition = startViewTransition(async () => {
    // dom changes
  })
  await viewTransition.captured
  return true;
})

export default router

interface ViewTransition {
  captured: Promise<void>
  updateCallbackDone: Promise<void>
  ready: Promise<void>
  finished: Promise<void>
  skipTransition: () => void
}

export function startViewTransition(callback?: () => Promise<void>): ViewTransition {
  const viewTransition = {} as ViewTransition
  if (document.startViewTransition) {
    const capturedPromise = new Promise<void>((resolve) => {
      const nativeViewTransition = document.startViewTransition(async () => {
        resolve()
        if (callback) {
          await callback()
        }
      })
      viewTransition.updateCallbackDone = nativeViewTransition.updateCallbackDone
      viewTransition.ready = nativeViewTransition.ready
      viewTransition.finished = nativeViewTransition.finished
      viewTransition.skipTransition =
        nativeViewTransition.skipTransition.bind(nativeViewTransition)
    })
    viewTransition.captured = capturedPromise
  } else {
    viewTransition.captured = Promise.resolve()
    const callbackPromise = callback ? Promise.resolve(callback()) : Promise.resolve()
    viewTransition.updateCallbackDone =
      viewTransition.ready =
      viewTransition.finished =
      callbackPromise
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    viewTransition.skipTransition = () => { }
    console.error(
      "[vue-view-transitions]: This browser doesn't support View Transitions Api, please check: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#browser_compatibility"
    )
  }
  return viewTransition
}