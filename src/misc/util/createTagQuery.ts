import { BlacklistMode } from "@/services/types";

// TODO: replace rating:e with rating:explicit ... when adding tags
//     str
//       .replace(/\brating:e\b/g, "rating:explicit")
//       .replace(/\brating:q\b/g, "rating:questionable")

//       .replace(/\brating:s\b/g, "rating:safe"),
export const createTagQuery = (
  mode: BlacklistMode,
  blacklist: string[],
  tags: string[],
) => {
  const allTags = [...tags];
  if (mode === BlacklistMode.hide) {
    allTags.push(...blacklist.map((t) => `-${t}`));
  }
  //   TODO: implications
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
  return allTags.slice(0, 6).join(" "); // limit tags + blacklisted tags to 6
};
