import runtime from "serviceworker-webpack-plugin/lib/runtime";
import { debug } from "debug";
const log = debug("app:sw-register");

let resolveWorker: (worker: ServiceWorkerContainer) => void = () => undefined;

export const serviceWorker = new Promise<ServiceWorkerContainer>(
  (resolve) => (resolveWorker = resolve),
);

export const registerServiceWorker = async () => {
  // if ("serviceWorker" in navigator) {
  //   await runtime.register();
  //   log("service worker registered");
  //   await navigator.serviceWorker.ready;
  //   log("service worker ready");
  //   if (navigator.serviceWorker.controller) {
  //     navigator.serviceWorker.addEventListener("message", (event) => {
  //       log("received message from service worker");
  //     });
  //     navigator.serviceWorker.addEventListener("controllerchange", (event) => {
  //       log("controller changed");
  //       // new version available, app should reload
  //       // window.location.reload();
  //       // notificationModule
  //       //   .setSnackbar({
  //       //     actions: [{ text: "reload now", identifier: "reload" }],
  //       //     closeable: true,
  //       //     color: "info",
  //       //     purpose: "Reload App After Update",
  //       //     text: "A new Version is available",
  //       //     timeout: 0,
  //       //   })
  //       //   .then((action) => {
  //       //     if (action && action.identifier === "reload") {
  //       //       commandModule.executeCommand("navigation.reload-page");
  //       //     }
  //       //   });
  //     });

  //     navigator.serviceWorker.controller.postMessage({
  //       text: "hi",
  //     });
  //     resolveWorker(navigator.serviceWorker);
  //   } else {
  //     // window needs to be reloaded in order to be controlled by a service worker (only for first install)
  //     //   notificationModule
  //     //     .setSnackbar({
  //     //       actions: [{ text: "reload now", identifier: "reload" }],
  //     //       closeable: true,
  //     //       color: "info",
  //     //       purpose: "Initially Reload App",
  //     //       text: "App needs to be reloaded to be controlled by a service worker",
  //     //       timeout: 0,
  //     //     })
  //     //     .then((action) => {
  //     //       if (action && action.identifier === "reload") {
  //     //         commandModule.executeCommand("navigation.reload-page");
  //     //       }
  //     //     });
  //   }
  // }
};
