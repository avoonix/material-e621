import runtime from "serviceworker-webpack-plugin/lib/runtime";
import { snackbarService } from "@/services";

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const registration = await runtime.register();
  if (!registration) {
    return;
  }
  if (registration.waiting) {
    snackbarService.addMessage("Update available, refresh to apply.");
  }
  registration.onupdatefound = () => {
    console.log("update found");
    const installingWorker = registration.installing;
    if (!installingWorker) {
      return;
    }
    installingWorker.onstatechange = () => {
      if (installingWorker.state === "installed") {
        if (navigator.serviceWorker.controller) {
          snackbarService.addMessage("Update available, refresh to apply.");
        } else {
          console.log("new content cached");
        }
      }
    };
  };
};

export const unregister = async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
};
