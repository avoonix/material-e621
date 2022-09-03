<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 md8 offset-md2>
        <v-expand-transition>
        <v-btn :to="query" class="mb-3" block color="primary" v-if="tags.length">View dashboard of {{tags[0]}}</v-btn>
        </v-expand-transition>
          <tag-search
            label="Search Artist"
            :tags="tags"
            @add-tag="addTag"
            @remove-tag="removeTag"
          />
          <!-- <v-text-field
            v-model="username"
            append-icon="mdi-send"
            @click:append="submit"
            label="Artist Tag"
          /> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { RawLocation } from "vue-router";
import TagSearch from "../Tag/TagSearch.vue";

export default defineComponent({
  metaInfo: {
    title: "Artist Dashboard",
  },
  components: {
    TagSearch,
  },
  setup(props, context) {
    const tags = ref<string[]>([]);
    const query = computed<RawLocation>(() => ({
      name: "DashboardResult",
      params: { name: tags.value[0] }
    }));
    const addTag = (tag: string) => tags.value = [tag];
    const removeTag = () => tags.value = [];
    return {
      tags,
      addTag,
      removeTag,
      query
    };
  },
});
</script>
