<template>
  <v-list dense>
    <template v-for="(tag, index) in tags">
      <v-list-item dense :key="index">
        <v-list-item-content>
          <div>
            <tag-label :tag="tag" />
          </div>
        </v-list-item-content>
        <v-list-item-action
          v-if="tag.post_count"
          class="grey--text text-caption"
        >
          {{ tag.post_count }}
        </v-list-item-action>
        <v-list-item-action class="ma-0" v-if="tag.category">
          <tag-favorite-button :category="tag.category" :name="tag.name" />
        </v-list-item-action>
        <v-list-item-action v-if="tag.category" class="ma-0">
          <tag-menu :tag="tag" />
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import { ITag, default as TagLabel } from "../Tag/TagLabel.vue";
import TagFavoriteButton from "@/Tag/TagFavoriteButton.vue";
import TagMenu from "@/Tag/TagMenu.vue";

export default defineComponent({
  components: {
    TagLabel,
    TagFavoriteButton,
    TagMenu,
  },
  props: {
    tags: {
      type: Array as PropType<ITag[]>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
