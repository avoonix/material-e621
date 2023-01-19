<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Post" color="darken-3 brown" />
        <settings-page-item title="Buttons" select>
          <post-button-editor :available-buttons="availableButtons" :fullscreen-buttons.sync="posts.fullscreenButtons"
            :details-buttons.sync="posts.detailsButtons" :post-buttons.sync="posts.buttons" />
        </settings-page-item>
        <settings-page-item title="Fullscreen arrow buttons" select>
          <v-select :items="fullscreenZoomUiModeItems" outlined hide-details v-model="posts.fullscreenZoomUiMode" />
        </settings-page-item>
        <settings-page-item title="Go fullscreen when viewing posts" switch>
          <v-switch v-model="posts.goFullscreen" />
        </settings-page-item>
        <settings-page-item title="Limits" select>
          <v-slider color="accent" class="my-0 mx-3" v-model="posts.postListFetchLimit" thumb-label :min="10" :max="320"
            label="Posts per page" />
          <v-slider color="accent" class="my-0 mx-3" v-model="posts.tagFetchLimit" thumb-label :min="10" :max="500"
            label="Tags" />
          <v-slider color="accent" class="my-0 mx-3" v-model="posts.sidebarSuggestionLimit" thumb-label :min="0"
            :max="500" label="Suggestions (sidebar)" />
        </settings-page-item>
        <settings-page-item title="Data saver" select
          description="Viewing posts in fullscreen will still show highest-quality images.">
          <template #description>
            <v-expand-transition>
              <automatic-data-saver-info v-if="showAutomaticDataSaverInfo" />
            </v-expand-transition>
          </template>
          <v-select :items="dataSaverItems" outlined hide-details v-model="posts.dataSaver" />
        </settings-page-item>
        <settings-page-item title="Lazy load images" switch
          description="Load images as you scroll past them, instead of all at once.">
          <v-switch v-model="posts.lazyLoad" />
        </settings-page-item>
        <settings-page-item title="Auto load next page" switch>
          <v-switch v-model="posts.autoLoad" />
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { usePostsStore } from "@/services";
import { DataSaverType, FullscreenZoomUiMode } from "@/services/types";
import { computed, defineComponent } from "vue";
import AutomaticDataSaverInfo from "./AutomaticDataSaverInfo.vue";
import PostButtonEditor from "./PostButtonEditor.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import SettingsPageTitle from "./SettingsPageTitle.vue";

export default defineComponent({
  metaInfo: {
    title: "Post Settings",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
    PostButtonEditor,
    AutomaticDataSaverInfo,
  },
  setup() {
    const posts = usePostsStore();
    const availableButtons = computed(() => posts.allButtonTypes);

    const fullscreenZoomUiModeItems = computed(() => [
      {
        text: "Always hide",
        value: FullscreenZoomUiMode.alwaysHide,
      },
      {
        text: "Always show",
        value: FullscreenZoomUiMode.neverHide,
      },
      {
        text: "Hide while zoomed in",
        value: FullscreenZoomUiMode.hideWhileZoomed,
      },
    ]);

    const dataSaverItems = computed(() => [
      {
        text: "Automatic",
        value: DataSaverType.auto,
      },
      {
        text: "Highest quality previews",
        value: DataSaverType.highest,
      },
      {
        text: "Medium quality previews",
        value: DataSaverType.medium,
      },
      {
        text: "Lowest quality previews",
        value: DataSaverType.lowest,
      },
    ]);

    const showAutomaticDataSaverInfo = computed(
      () => posts.dataSaver === DataSaverType.auto,
    );

    return {
      availableButtons,
      fullscreenZoomUiModeItems,
      dataSaverItems,
      showAutomaticDataSaverInfo,
      posts,
    };
  },
});
</script>
