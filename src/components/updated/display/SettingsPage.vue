<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 md8 offset-md2>
        <settings-page-section
          section="blacklist"
          title="Blacklist"
          icon="mdi-playlist-remove"
          color="darken-1 red"
        ></settings-page-section>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SettingsPageSection from "./SettingsPageSection";

export default {
  metaInfo: {
    title: "Settings",
  },
  components: {
    SettingsPageSection,
  },
};
</script>
