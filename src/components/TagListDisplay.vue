<template>
  <span>
    <tag-label
      v-for="(tag, i) in parsedTags"
      :key="i"
      :tag="tag"
      :show-numbers="showNumbers"
    />
  </span>
</template>

<script>
import TagLabel from "./TagLabel";
import { GETTERS } from "../store/constants";

const defaultTag = {
  color: "blue-grey",
  text: "[No text]",
  count: 0,
  // display: ,
  // category: ,
};

export default {
  props: {
    tags: {
      type: [String, Array],
      required: true,
    },
    showNumbers: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TagLabel,
  },
  computed: {
    parsedTags() {
      if (typeof this.tags == "string") {
        return this.tags
          .split(" ")
          .filter((str) => str.length)
          .map(this.getTagFromStore);
      }
      return this.tags;
    },
  },
  methods: {
    getTagFromStore(text) {
      if (!text) return defaultTag;
      if (text) text = text.replace(/^\-/, "");
      // TODO: get tag colors
      // const tag = this.$store.getters[GETTERS.GET_TAGS][text];
      // if(tag){
      //   return tag;
      // }
      return { ...defaultTag, text: text };
    },
  },
};
</script>
