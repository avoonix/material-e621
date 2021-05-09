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
        <settings-page-item title="Hide UI while zoomed (fullscreen)" switch>
          <v-switch v-model="hideFullscreenUiOnZoom"></v-switch>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import { computed, defineComponent } from "@vue/composition-api";
import { ButtonType } from "@/services/types";
import { postService } from "@/services";
import PostButtonEditor from "./PostButtonEditor.vue";

export default defineComponent({
  metaInfo: {
    title: "Post Settings",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
    PostButtonEditor,
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
    const hideFullscreenUiOnZoom = computed<boolean>({
      get() {
        return postService.hideFullscreenUiOnZoom;
      },
      set(value) {
        postService.hideFullscreenUiOnZoom = value;
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

    return {
      availableButtons,
      postButtons,
      fullscreenButtons,
      detailsButtons,
      hideFullscreenUiOnZoom,
      sidebarSuggestionLimit,
      postListFetchLimit,
      tagFetchLimit,
    };
  },
});
</script>
