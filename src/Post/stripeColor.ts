import { useAppearanceStore } from "@/services";
import type { Post } from "@/worker/api";
import { computed } from "vue";

export const getColor = (rating: string) => {
  switch (rating?.toLowerCase()) {
    case "e":
      return "red";

    case "s":
      return "green";

    case "q":
      return "yellow";
  }
  return "";
};

export const useStripeColor = ({ post }: { post: Post }) => {
  const appearance = useAppearanceStore();
  const stripeColor = computed<string>(() => {
    if (!appearance.ratingStripe) {
      return "";
    }
    return getColor(post.rating);
  });

  return {
    stripeColor,
  };
};
