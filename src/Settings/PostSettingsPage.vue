<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 md8 offset-md2>
        <settings-page-title title="Post" color="darken-3 brown" />
        <settings-page-item title="Buttons" select>
          <post-button-editor
            :available-buttons="availableButtons"
            :fullscreen-buttons.sync="fullscreenButtons"
            :details-buttons.sync="detailsButtons"
            :post-buttons.sync="postButtons"
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

    return {
      availableButtons,
      postButtons,
      fullscreenButtons,
      detailsButtons,
    };
  },
});
</script>
