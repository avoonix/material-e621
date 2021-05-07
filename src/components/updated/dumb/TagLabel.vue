<template>
  <v-chip v-on="$listeners" v-bind="$attrs">
    <!-- TODO: do propery -->
    <!-- <v-chip v-on="$listeners" v-bind="$attrs" :class="classes" :title="title"> -->
    <!-- {{ text }} -->
    {{ tag.name || tag.text || tag }}
  </v-chip>
</template>

<script lang="ts">
import { PropType } from "@vue/composition-api";

export interface ITag {
  name: string;
  post_count: number;
  category: string;
}

export default {
  inheritAttrs: false,
  props: {
    tag: {
      type: Object as PropType<ITag>,
      required: true,
    },
    // showNumbers: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  computed: {
    // text() {
    //   if (this.isFromApiWorker) {
    //     return this.tag.name;
    //   }
    //   let retVal = this.tag.text;
    //   if (this.showNumbers && this.tag.count) {
    //     retVal += ` (${this.tag.count})`;
    //   }
    //   return retVal;
    // },
    // title() {
    //   if (this.isFromApiWorker) {
    //     return this.text;
    //   }
    //   return (
    //     (this.tag.count ? `Count: ${this.tag.count}\n` : "") +
    //     (this.tag.category ? `Category: ${this.tag.category}` : "")
    //   );
    // },
    // classes() {
    //   const color = this.isFromApiWorker
    //     ? getTagColorFromCategoryId(this.tag.category)
    //     : this.tag.color;
    //   return { [color]: true };
    // },
    // isFromApiWorker() {
    //   return !!this.tag.created_at;
    // },
  },
};
</script>
