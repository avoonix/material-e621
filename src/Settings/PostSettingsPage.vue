<template>
  <v-container class="fill-height d-flex align-center flex-wrap">
    <v-row>
      <v-col class="text-center" cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
        <settings-page-title section="posts" title="Post" color="brown-darken-3" />
        <settings-page-item title="Buttons" select>
          <post-button-editor :available-buttons="availableButtons" v-model:fullscreen-buttons="posts.fullscreenButtons"
            v-model:details-buttons="posts.detailsButtons" v-model:post-buttons="posts.buttons" />
        </settings-page-item>
        <settings-page-item title="Fullscreen arrow buttons" select>
          <v-select :items="fullscreenZoomUiModeItems" variant="outlined" hide-details
            v-model="posts.fullscreenZoomUiMode" />
        </settings-page-item>
        <settings-page-item title="Go fullscreen when viewing posts" switch>
          <v-switch v-model="posts.goFullscreen" />
        </settings-page-item>
        <settings-page-item title="Limits" select>
          <v-number-input v-model="posts.postListFetchLimit" v-bind="postLimitRanges.postListFetchLimit"
            variant="outlined" color="accent" label="Posts per page" />
          <v-number-input v-model="posts.tagFetchLimit" v-bind="postLimitRanges.tagFetchLimit" variant="outlined"
            color="accent" label="Tags" />
          <v-number-input v-model="posts.sidebarSuggestionLimit" v-bind="postLimitRanges.sidebarSuggestionLimit"
            variant="outlined" color="accent" label="Suggestions (sidebar)" />
        </settings-page-item>
        <settings-page-item title="Data saver" select
          description="Viewing posts in fullscreen will still show highest-quality images.">
          <template #description>
            <v-expand-transition>
              <automatic-data-saver-info v-if="showAutomaticDataSaverInfo" />
            </v-expand-transition>
          </template>
          <v-select :items="dataSaverItems" variant="outlined" hide-details v-model="posts.dataSaver" />
        </settings-page-item>
        <settings-page-item title="Lazy load images" switch
          description="Load images as you scroll past them, instead of all at once.">
          <v-switch v-model="posts.lazyLoad" />
        </settings-page-item>
        <settings-page-item title="Auto load next page" switch>
          <v-switch v-model="posts.autoLoad" />
        </settings-page-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { postLimitRanges, usePostsStore } from "@/services";
import { DataSaverType, FullscreenZoomUiMode } from "@/services/types";
import { computed, defineComponent } from "vue";
import AutomaticDataSaverInfo from "./AutomaticDataSaverInfo.vue";
import PostButtonEditor from "./PostButtonEditor.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import SettingsPageTitle from "./SettingsPageTitle.vue";
import { useHead } from "@unhead/vue";

useHead({
  title: "Post Settings",
});

const posts = usePostsStore();
const availableButtons = computed(() => posts.allButtonTypes);

const fullscreenZoomUiModeItems = computed(() => [
  {
    title: "Always hide",
    value: FullscreenZoomUiMode.alwaysHide,
  },
  {
    title: "Always show",
    value: FullscreenZoomUiMode.neverHide,
  },
  {
    title: "Hide while zoomed in",
    value: FullscreenZoomUiMode.hideWhileZoomed,
  },
]);

const dataSaverItems = computed(() => [
  {
    title: "Automatic",
    value: DataSaverType.auto,
  },
  {
    title: "Highest quality previews",
    value: DataSaverType.highest,
  },
  {
    title: "Medium quality previews",
    value: DataSaverType.medium,
  },
  {
    title: "Lowest quality previews",
    value: DataSaverType.lowest,
  },
]);

const showAutomaticDataSaverInfo = computed(
  () => posts.dataSaver === DataSaverType.auto,
);

</script>
