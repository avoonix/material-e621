import { GETTERS } from "../store/constants";
import { postIsBlacklisted } from "../store/api";
import prettyBytes from "pretty-bytes";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import formatDate from "date-fns/format";

self.addEventListener("message", ({ data: { taskID, taskName, data } }) => {
  const result = tasks[taskName](data);
  self.postMessage({
    result,
    taskID,
  });
});

const tasks = {
  [GETTERS.GET_POST](data) {
    const result = {};
    for (const [id, post] of Object.entries(data.allPosts)) {
      if (!post) continue;
      const isFavorited = !!data.favoritedPosts.find((id) => id == post.id);
      let isBlacklisted = false;
      if (data.blacklistMode !== "tags") {
        isBlacklisted = postIsBlacklisted({
          post: post,
          blacklist: data.blacklistQuery,
        });
      }
      if (
        (data.blacklistMode == "dynamic" || data.blacklistMode == "hide") &&
        isBlacklisted
      ) {
        continue;
      }
      const allTags = Object.values(post.tags)
        .reduceRight((prev, cur) => [...cur, ...prev], [])
        .join(" ");
      result[id] = {
        ...post,
        custom_favorited_by_user: isFavorited,
        custom_blacklisted_by_user: isBlacklisted,
        custom_pretty_file_size: prettyBytes(post.file_size),
        custom_pretty_relative_upload_date: distanceInWordsToNow(
          post.created_at.s * 1000,
          {
            addSuffix: true,
          },
        ),
        custom_pretty_upload_date: formatDate(
          post.created_at.s * 1000,
          "MMMM D, YYYY h:mm A",
        ),
        custom_all_tags: allTags,
      };
    }
    return result;
  },
};
