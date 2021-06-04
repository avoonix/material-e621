<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Post" color="darken-3 brown" />
        <settings-page-item title="Buttons" select>
          <post-button-editor
            :available-buttons="availableButtons"
            :fullscreen-buttons.sync="fullscreenButtons"
            :details-buttons.sync="detailsButtons"
            :post-buttons.sync="postButtons"
          />
        </settings-page-item>
        <settings-page-item title="Fullscreen arrow buttons" select>
          <v-select
            :items="fullscreenZoomUiModeItems"
            box
            solo
            hide-details
            v-model="fullscreenZoomUiMode"
          />
        </settings-page-item>
        <settings-page-item title="Go fullscreen when viewing posts" switch>
          <v-switch v-model="goFullscreen"></v-switch>
        </settings-page-item>
        <settings-page-item title="Limits" select>
          <v-slider
            color="accent"
            class="my-0 mx-3"
            v-model="postListFetchLimit"
            thumb-label
            :min="10"
            :max="320"
            label="Posts per page"
          />
          <v-slider
            color="accent"
            class="my-0 mx-3"
            v-model="tagFetchLimit"
            thumb-label
            :min="10"
            :max="500"
            label="Tags"
          />
          <v-slider
            color="accent"
            class="my-0 mx-3"
            v-model="sidebarSuggestionLimit"
            thumb-label
            :min="0"
            :max="500"
            label="Suggestions (sidebar)"
          />
        </settings-page-item>
        <settings-page-item
          title="Data saver"
          select
          description="Viewing posts in fullscreen will still show highest-quality images."
        >
          <template #description>
            <v-expand-transition>
              <automatic-data-saver-info v-if="showAutomaticDataSaverInfo" />
            </v-expand-transition>
          </template>
          <v-select
            :items="dataSaverItems"
            box
            solo
            hide-details
            v-model="dataSaver"
          />
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import { computed, defineComponent } from "@vue/composition-api";
import {
  ButtonType,
  DataSaverType,
  FullscreenZoomUiMode,
} from "@/services/types";
import { postService } from "@/services";
import PostButtonEditor from "./PostButtonEditor.vue";
import AutomaticDataSaverInfo from "./AutomaticDataSaverInfo.vue";

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
    const availableButtons: ButtonType[] = ["info", "fullscreen", "external"];
    const postButtons = computed<ButtonType[]>({
      get() {
        return postService.buttons;
      },
      set(value) {
        postService.buttons = value;
      },
    });
    const fullscreenButtons = computed<ButtonType[]>({
      get() {
        return postService.fullscreenButtons;
      },
      set(value) {
        postService.fullscreenButtons = value;
      },
    });
    const detailsButtons = computed<ButtonType[]>({
      get() {
        return postService.detailsButtons;
      },
      set(value) {
        postService.detailsButtons = value;
      },
    });

    const sidebarSuggestionLimit = computed<number>({
      get() {
        return postService.sidebarSuggestionLimit;
      },
      set(value) {
        postService.sidebarSuggestionLimit = value;
      },
    });
    const tagFetchLimit = computed<number>({
      get() {
        return postService.tagFetchLimit;
      },
      set(value) {
        postService.tagFetchLimit = value;
      },
    });
    const postListFetchLimit = computed<number>({
      get() {
        return postService.postListFetchLimit;
      },
      set(value) {
        postService.postListFetchLimit = value;
      },
    });
    const goFullscreen = computed<boolean>({
      get() {
        return postService.goFullscreen;
      },
      set(value) {
        postService.goFullscreen = value;
      },
    });

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

    const fullscreenZoomUiMode = computed<FullscreenZoomUiMode>({
      get() {
        return postService.fullscreenZoomUiMode;
      },
      set(value) {
        postService.fullscreenZoomUiMode = value;
      },
    });

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

    const dataSaver = computed<DataSaverType>({
      get() {
        return postService.dataSaver;
      },
      set(value) {
        postService.dataSaver = value;
      },
    });

    const showAutomaticDataSaverInfo = computed(
      () => postService.dataSaver === DataSaverType.auto,
    );

    return {
      goFullscreen,
      availableButtons,
      postButtons,
      fullscreenButtons,
      detailsButtons,
      sidebarSuggestionLimit,
      postListFetchLimit,
      tagFetchLimit,
      fullscreenZoomUiMode,
      fullscreenZoomUiModeItems,
      dataSaver,
      dataSaverItems,
      showAutomaticDataSaverInfo,
    };
  },
});
</script>
