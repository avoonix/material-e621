import { useRoute } from "@/misc/util/router";
import { updateRouterQuery } from "@/misc/util/utilities";
import { computed, ref, watch } from "vue";

export const useRouterTagManager = () => {
  const route = useRoute();
  const tempTags = ref<string[]>([]);
  const tags = computed<string[]>({
    get() {
      if (!route.query.tags) {
        return [];
      }
      const tags = route.query.tags as any;
      return tags.split(" ").filter((t: any) => t);
    },
    set(value) {
      updateRouterQuery({
        tags: value.join(" "),
      });
    },
  });
  watch(tags, () => (tempTags.value = [...tags.value]), { immediate: true });
  const updateQuery = () => (tags.value = [...tempTags.value]);
  const addTag = (tag: string) => {
    tempTags.value = [...tempTags.value, (tag)];
  };
  const removeTag = (tag: string) => {
    tempTags.value = tempTags.value.filter((t) => t !== tag);
  };
  const setTags = (tags: string[]) => {
    tempTags.value = [...tags];
  };
  return {
    tags: tempTags,
    query: tags,
    addTag,
    removeTag,
    updateQuery,
    setTags,
  };
};
