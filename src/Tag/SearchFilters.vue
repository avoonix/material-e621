<template>
  <v-list-item>
    <div class="d-flex flex-column flex-md-row fill-width" style="gap: 8px;">
      <v-select v-model="sortBy" item-text="name" item-value="tag" hide-details outlined label="Sort by" :items="sortTags"
        class="fill-width shrink" />
      <v-select v-model="rating" item-text="name" item-value="tag" hide-details outlined label="Rating"
        :items="ratingTags" multiple class="fill-width shrink" />
    </div>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";

// https://e621.net/help/cheatsheet
const sortTags = [
  { tag: null, name: "Date (newest first) - Default" }, // default
  { tag: "order:id", name: "Date (oldest first)" },
  { tag: "order:rank", name: "Hot (hottest first)" },
  { tag: "order:change", name: "Change (most recent first)" },

  { tag: "order:score", name: "Score (highest first)" },
  { tag: "order:score_asc", name: "Score (lowest first)" },
  { tag: "order:favcount", name: "Favorites (most first)" },
  { tag: "order:favcount_asc", name: "Favorites (least first)" },
  { tag: "order:tagcount", name: "Tags (most first)" },
  { tag: "order:tagcount_asc", name: "Tags (least first)" },
  { tag: "order:comment_count", name: "Comments (most first)" },
  { tag: "order:comment_count_asc", name: "Comments (least first)" },
  { tag: "order:comment_bumped", name: "Comments (newest first)" },
  { tag: "order:comment_bumped_asc", name: "Comments (oldest first)" },
  { tag: "order:mpixels", name: "Resolution (largest first)" },
  { tag: "order:mpixels_asc", name: "Resolution (smallest first)" },
  { tag: "order:filesize", name: "Filesize (largest first)" },
  { tag: "order:filesize_asc", name: "Filesize (smallest first)" },
  { tag: "order:landscape", name: "Aspect Ratio (widest first)" },
  { tag: "order:portrait", name: "Aspect Ratio (tallest first)" },
  { tag: "order:duration", name: "Video Duration (longest first)" },
  { tag: "order:duration_asc", name: "Video Duration (shortest first)" },

  { tag: "order:chartags", name: "Character Tags (most first)" },
  { tag: "order:chartags_asc", name: "Character Tags (least first)" },
  { tag: "order:arttags", name: "Artist Tags (most first)" },
  { tag: "order:arttags_asc", name: "Artist Tags (least first)" },
  { tag: "order:gentags", name: "General Tags (most first)" },
  { tag: "order:gentags_asc", name: "General Tags (least first)" },
  { tag: "order:copytags", name: "Copyright Tags (most first)" },
  { tag: "order:copytags_asc", name: "Copyright Tags (least first)" },
  { tag: "order:spectags", name: "Species Tags (most first)" },
  { tag: "order:spectags_asc", name: "Species Tags (least first)" },
  { tag: "order:metatags", name: "Meta Tags (most first)" },
  { tag: "order:metatags_asc", name: "Meta Tags (least first)" },
  { tag: "order:lortags", name: "Lore Tags (most first)" },
  { tag: "order:lortags_asc", name: "Lore Tags (least first)" },
];

const ratingTags = [
  { tag: "rating:safe", name: "Safe" },
  { tag: "rating:questionable", name: "Questionable" },
  { tag: "rating:explicit", name: "Explicit" },
];

export default defineComponent({
  props: {
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    }
  },
  setup(props, context) {
    const rating = computed<string[]>({
      get() {
        let result = ["rating:explicit", "rating:questionable", "rating:safe"];
        const includedTags = props.tags.filter(t => t.startsWith("rating:"));
        const excludedTags = props.tags.filter(t => t.startsWith("-rating:"));
        result = includedTags.length ? includedTags : result; // no included tags -> show all ratings
        result = result.filter(t => !excludedTags.includes(`-${t}`))
        return result;
      },
      set(value) {
        const all = ["rating:explicit", "rating:questionable", "rating:safe"];
        all.forEach(t => { removeTag(`-${t}`); removeTag(t) });
        if (!value.length || value.length === all.length) return
        if (value.length === all.length - 1) {
          const missingTag = all.find(t => !value.includes(t))
          addTag(`-${missingTag}`)
          return;
        }
        if (value.length === 1) {
          addTag(value[0]);
          return;
        }
      }
    })

    const sortBy = computed<string | null>({
      get() {
        return props.tags.find(t => t.startsWith("order:")) || null;
      },
      set(value) {
        props.tags.filter(t => t.startsWith("order:")).forEach(removeTag)
        if (value) {
          addTag(value);
        }
      }
    })

    const addTag = (tag: string) => context.emit("add-tag", tag);
    const removeTag = (tag: string) => context.emit("remove-tag", tag);

    return {
      sortTags,
      ratingTags,
      rating,
      sortBy,
    };
  },
});
</script>
