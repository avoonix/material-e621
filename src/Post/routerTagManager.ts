import router from "@/router";
import { updateRouterQuery } from "@/utilities/utilities";
import { computed } from "@vue/composition-api";

export const useRouterTagManager = () => {
  const tags = computed<string[]>({
    get() {
      if (!router.currentRoute.query.tags) {
        return [];
      }
      const tags = router.currentRoute.query.tags as any;
      return tags.split(" ").filter((t: any) => t);
    },
    set(value) {
      updateRouterQuery(router, {
        tags: value.join(" "),
      });
    },
  });
  const addTag = (tag: string) => {
    tags.value = [...tags.value, tag];
  };
  const removeTag = (tag: string) => {
    tags.value = tags.value.filter((t) => t !== tag);
  };
  return {
    tags,
    addTag,
    removeTag,
  };
};
