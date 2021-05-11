import { useRoute } from "@/misc/util/router";
import router from "@/router";
import { updateRouterQuery } from "@/misc/util/utilities";
import { computed } from "@vue/composition-api";

export const useRouterTagManager = () => {
  const route = useRoute();
  const tags = computed<string[]>({
    get() {
      if (!route.query.tags) {
        return [];
      }
      const tags = route.query.tags as any;
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
