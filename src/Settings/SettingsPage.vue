<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-section
          section="info"
          title="Info"
          icon="mdi-information"
          color="darken-2 teal"
        ></settings-page-section>
        <settings-page-section
          section="blacklist"
          title="Blacklist"
          icon="mdi-playlist-remove"
          color="darken-1 red"
        ></settings-page-section>
        <settings-page-section
          section="appearance"
          title="Appearance"
          icon="mdi-palette"
          color="darken-1 pink"
        ></settings-page-section>
        <settings-page-section
          section="history"
          title="History"
          icon="mdi-format-list-bulleted"
          color="darken-1 green"
        ></settings-page-section>
        <settings-page-section
          section="restore"
          title="Backup and restore"
          icon="mdi-backup-restore"
          color="darken-1 blue"
        ></settings-page-section>
        <settings-page-section
          section="account"
          title="Account"
          icon="mdi-account"
          color="darken-3 yellow"
        ></settings-page-section>
        <settings-page-section
          section="posts"
          title="Posts"
          icon="mdi-format-list-text"
          color="darken-3 brown"
        ></settings-page-section>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import SettingsPageSection from "./SettingsPageSection.vue";

export default defineComponent({
  metaInfo: {
    title: "Settings",
  },
  components: {
    SettingsPageSection,
  },
});
</script>
