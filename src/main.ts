import "./misc/serviceWorker/register";
import '@asika32764/vue-animate/dist/vue-animate.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
const env = import.meta.env;
const getApp = async () => {
    if ("VITE_MIGRATE_TO_DOMAIN" in env) {
        return (await import('./Migration/MigrationPage.vue')).default;
    } else {
        return (await import('./App.vue')).default;
    }
};
// import App from './App.vue'
import router from './router'
import { vuetify, head } from './misc/plugins'
import PortalVue from "portal-vue";
import { showConsoleMessage } from "./misc/util/consoleMessage";

// if ("VITE_MIGRATION_CONFIG" in env) {
//     const {from,to}: {from: string[], to: string} = JSON.parse(env.VITE_MIGRATION_CONFIG);
//     const origin = window.location.origin;
//     debugger;
//     if (origin === to) {
//         acceptMigration(from)
//     } else if (from.includes(origin)) {
//         migrateDomain(to)
//     }
// }

function setViewTransitionName(
    el: any,
    value: string | Record<string, boolean>,
    directiveName: 'view-transition-name' | 'trans'
) {
    if (typeof value === 'string') {
        el.style.viewTransitionName = value
    } else if (value && typeof value === 'object') {
        const [viewTransitionName, active] = Object.entries(value)?.[0] || []
        if (active) {
            el.style.viewTransitionName = viewTransitionName
        } else {
            el.style.viewTransitionName = 'none'
        }
    } else {
        throw new Error(
            `[vue-view-transitions]: The value of \`v-${directiveName}\` should be either "string" or "object" but got "${typeof value}"`
        )
    }
}

if (import.meta.env.PROD) showConsoleMessage();

getApp().then(App => {

    const app = createApp(App)

    app.directive('view-transition-name', {
        beforeMount(el, binding) {
            setViewTransitionName(el, binding.value, 'view-transition-name')
        },
        beforeUpdate(el, binding) {
            setViewTransitionName(el, binding.value, 'view-transition-name')
        }
    })

    app.directive('trans', {
        beforeMount(el, binding) {
            setViewTransitionName(el, binding.value, 'trans')
        },
        beforeUpdate(el, binding) {
            setViewTransitionName(el, binding.value, 'trans')
        }
    })

    app.use(createPinia())
    app.use(router)
    app.use(vuetify)
    app.use(PortalVue)
    app.use(head)

    app.mount('#app')

    // Vue.config.errorHandler = (err, vm, info) => {
    //   const snackbar = useSnackbarStore();
    //   console.error(err, vm, info);
    //   snackbar.addMessage(`Error: ${err.message}`);
    // };
})
