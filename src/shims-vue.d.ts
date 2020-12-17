declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.js" {
  const a: any;
  export default a;
  export const store: any;
}

declare module "worker-loader*" {
  const a: any;
  export default a;
}
