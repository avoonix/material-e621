import router from "@/router";
import { reactive, readonly } from "@vue/composition-api";
import { isEqual, pick } from "lodash";

// workaround for vue2 router

const keys = [
  "fullPath",
  "hash",
  "meta",
  "name",
  "params",
  "path",
  "query",
] as const;

const currentRoute = reactive(pick(router.currentRoute, ...keys));

router.afterEach((to, from) => {
  const newRoute = pick(to, ...keys);
  if (isEqual(currentRoute, newRoute)) {
    return;
  }
  Object.keys(newRoute).forEach((key) => {
    (currentRoute as any)[key] = Object.freeze((newRoute as any)[key]);
    // Object.assign(currentRoute, newRoute);
  });
});

export const useRoute = () => {
  return readonly(currentRoute);
};
