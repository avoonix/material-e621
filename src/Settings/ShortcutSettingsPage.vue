<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Keyboard Shortcuts" color="black" />
        <keyboard-shortcut-editor class="mt-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import { defineComponent } from "vue";
import KeyboardShortcutEditor from "./KeyboardShortcutEditor.vue";

export default defineComponent({
  metaInfo: {
    title: "Keyboard Shortcuts",
  },
  components: {
    SettingsPageTitle,
    KeyboardShortcutEditor
  },
  setup(props, context) {
    return {
    };
  },
});
</script>
