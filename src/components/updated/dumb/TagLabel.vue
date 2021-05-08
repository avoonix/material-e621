<template>
  <v-chip :color="color" v-on="$listeners" v-bind="$attrs" :title="title">
    {{ tag.name }}
  </v-chip>
</template>

<script lang="ts">
import { getTagColorFromCategory } from "@/utilities/utilities";
import { computed, defineComponent, PropType } from "@vue/composition-api";

export interface ITag {
  name: string;
  post_count: number;
  category: string;
}

export default defineComponent({
  inheritAttrs: false,
  props: {
    tag: {
      type: Object as PropType<ITag>,
      required: true,
    },
  },
  setup(props, context) {
    const color = computed(() => getTagColorFromCategory(props.tag.category));
    const title = computed(() => {
      const count = props.tag.post_count
        ? `\nPosts: ${props.tag.post_count}`
        : "";
      return `Name: ${props.tag.name}\nCategory: ${props.tag.category}${count}`;
    });

    return {
      color,
      title,
    };
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
});
</script>
