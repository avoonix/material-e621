declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
declare module "serviceworker-webpack-plugin/lib/runtime" {
  export default {
    register(
      options: RegistrationOptions = {},
    ): false | Promise<ServiceWorkerRegistration>;,
  };
}
declare module "vuetify/es5/util/colors";
declare module "d3-cloud";
declare module "scroll-into-view";
declare module "vue-intersect";
