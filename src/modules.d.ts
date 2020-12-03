declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
declare module "serviceworker-webpack-plugin/lib/runtime";
