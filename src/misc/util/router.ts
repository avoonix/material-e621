import { reactive, readonly } from "vue";
import { isEqual, pick } from "lodash";

const { router } = await import("@/main");

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
  return(currentRoute);
};

export const appRouter = router; // I used to be able to use the router from "@/router", but since switching to vite it behaves weird
