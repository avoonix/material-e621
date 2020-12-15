import { Post } from "../api";
import debug from "debug";

const log = debug("app:blacklist");

export const isPostBlacklisted = (post: Post, blacklist?: string[]) => {
  if (!blacklist) {
    log("no blacklist");
    return false;
  }
  const postTags = Object.values(post.tags).flat() as string[];
  // const blacklistTags = blacklist
  //   .split(" ")
  //   .map((tag) => tag.replace(/$-/, ""))
  //   .filter((tag) => tag.length);
  log(postTags);
  switch (post.rating) {
    case "e":
      postTags.push("rating:e", "rating:explicit");
      break;
    case "q":
      postTags.push("rating:q", "rating:questionable");
      break;
    case "s":
      postTags.push("rating:s", "rating:safe");
      break;
  }
  for (const tag of postTags) {
    if (blacklist.indexOf(tag) !== -1) {
      return true;
    }
  }
  return false;
};

// const createQuery = (blacklistMode, blacklistStr, tagsStr) => {
//   const includeBlacklistInQuery =
//     blacklistMode === "dynamic" || blacklistMode === "tags"; // other implementations hide/blur/blackout posts
//   const tagsArr = [
//     ...tagsStr.split(" ").filter((str) => str.length > 0),
//     ...(includeBlacklistInQuery
//       ? blacklistStr
//           .split(" ")
//           .filter((str) => str.length > 0)
//           .map((str) => (str.startsWith("-") ? str : "-" + str))
//       : []),
//   ].map((str) =>
//     str
//       .replace(/\brating:e\b/g, "rating:explicit")
//       .replace(/\brating:q\b/g, "rating:questionable")
//       .replace(/\brating:s\b/g, "rating:safe"),
//   );

//   const implications = [
//     {
//       contains: ["-rating:explicit", "-rating:questionable"],
//       replace: "rating:safe",
//     },
//     {
//       contains: ["-rating:safe", "-rating:questionable"],
//       replace: "rating:explicit",
//     },
//     {
//       contains: ["-rating:safe", "-rating:explicit"],
//       replace: "rating:questionable",
//     },
//     {
//       contains: ["rating:explicit", "rating:questionable"],
//       replace: "-rating:safe",
//     },
//     {
//       contains: ["rating:safe", "rating:questionable"],
//       replace: "-rating:explicit",
//     },
//     {
//       contains: ["rating:safe", "rating:explicit"],
//       replace: "-rating:questionable",
//     },
//   ];

//   // e621 can't process duplicate metatags - they have to be converted (eg -rating:safe + -rating:questionable => rating:explicit)
//   for (const implication of implications) {
//     let matches = true;
//     for (const str of implication.contains) {
//       if (tagsArr.indexOf(str) === -1) {
//         matches = false;
//         break;
//       }
//     }
//     if (matches) {
//       tagsArr.push(implication.replace);
//       for (const str of implication.contains) {
//         const index = tagsArr.indexOf(str);
//         tagsArr.splice(index, 1);
//       }
//     }
//   }

//   // reorder the tags based on importance (matters if the array contains more than 6 tags)
//   const positiveTags = [],
//     negativeTags = [];
//   let sortedArr = []; // everything in here will be the first elements of the result array; it's fine to put tags in there that are also in positiveTags or negativeTags because of uniq
//   for (const tag of tagsArr) {
//     if (tag.indexOf("rating:") !== -1) {
//       sortedArr.push(tag);
//     } else if (tag.startsWith("-")) {
//       negativeTags.push(tag);
//     } else {
//       positiveTags.push(tag);
//     }
//   }

//   const result = uniq([
//     ...sortedArr,
//     ...positiveTags,
//     ...negativeTags.sort((a, b) => {
//       // also sort based on posts per tag(if available)
//       // let countA = (allTags[a.replace(/^-/, "")] || {}).count || 0;
//       // let countB = (allTags[b.replace(/^-/, "")] || {}).count || 0;
//       let countA = 0;
//       let countB = 0;
//       // rank metatags a bit higher than tags without a count
//       if (a.indexOf(":") !== -1) countA++;
//       if (b.indexOf(":") !== -1) countB++;
//       return countB - countA;
//     }),
//   ]);
//   // console.log(result);
//   return result.slice(0, 6).join(" "); // limit tags + blacklisted tags to 6
// };
