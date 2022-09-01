import { appearanceService } from "@/services";
import { Post } from "@/worker/api";
import { computed } from "vue";

export const useStripeColor = ({ post }: { post: Post }) => {
  const stripeColor = computed<string>(() => {
    if (!appearanceService.ratingStripe) {
      return "";
    }
    switch (post.rating) {
      case "e":
        return "red";

      case "s":
        return "green";

      case "q":
        return "yellow";
    }
    return "";
  });

  return {
    stripeColor,
  };
};
