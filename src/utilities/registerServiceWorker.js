/* eslint-disable no-console */

import { register } from "register-service-worker";

export default ({ updated }) => {
  if (process.env.NODE_ENV !== "development") {
    register(`${process.env.BASE_URL}service-worker.js`, {
      registered() {
        console.log("Service worker registered");
      },
      ready() {
        console.log(
          "App is being served from cache by a service worker.\n" +
            "For more details, visit https://goo.gl/AFskqB",
        );
      },
      cached() {
        console.log("Content has been cached for offline use.");
      },
      updated() {
        console.log("New content is available; please refresh.");
        updated();
      },
      offline() {
        console.log(
          "No internet connection found. App is running in offline mode.",
        );
      },
      error(error) {
        console.error("Error during service worker registration:", error);
      },
    });
  }
};
