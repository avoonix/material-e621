import { register, unregister } from "register-service-worker";

export const registerServiceWorker = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("skipping service worker registration");
    unregister();
    return;
  }

  // register(`${process.env.BASE_URL}service-worker.js`, {
  //   registrationOptions: {},
  //   registered() {
  //     console.log("Service worker registered");
  //   },
  //   ready() {
  //     console.log(
  //       "App is being served from cache by a service worker.\n" +
  //         "For more details, visit https://goo.gl/AFskqB",
  //     );
  //   },
  //   cached() {
  //     console.log("Content has been cached for offline use.");
  //   },
  //   updated() {
  //     console.log("New content is available; please refresh.");
  //   },
  //   offline() {
  //     console.log(
  //       "No internet connection found. App is running in offline mode.",
  //     );
  //   },
  //   error(error) {
  //     console.error("Error during service worker registration:", error);
  //   },
  //   updatefound(registration) {
  //     console.log("update found", registration);
  //   },
  // });
};
