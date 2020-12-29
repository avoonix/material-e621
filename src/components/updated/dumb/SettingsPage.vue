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
        <!-- text="Change your blacklist settings." -->
        <!-- :text="`Change the overall theme of ${$appName}.`" -->

        <!-- <v-flex xs12 sm8 offset-sm2 lg6 offset-lg3>
          <v-card>
            <div class="blue-grey">
              <v-icon size="200">mdi-information</v-icon>
            </div>
            <v-card-title primary-title>
              <div class="title mb-2">Information</div>
            </v-card-title>
            <v-card-title class="mt-0 pt-0">
              <span class="grey--text"
                >View the changelog or tutorial here</span
              >
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                flat
                color="accent"
                :to="{
                  path: '/settings/setup/1',
                  query: $store.state.routerModule.query,
                }"
                >Tutorial</v-btn
              >
              <v-btn
                flat
                color="accent"
                :to="{
                  path: '/about',
                  query: $store.state.routerModule.query,
                }"
                >About</v-btn
              >
              <v-btn
                flat
                color="accent"
                :to="{
                  path: '/install',
                  query: $store.state.routerModule.query,
                }"
                >Installation</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex> -->
        <!-- <settings-page-preview
          section="posts"
          ref="posts"
          title="Posts"
          icon="mdi-view-dashboard-variant"
          color="darken-1 green"
          text="Change the post layout and customize the button layout."
        >
          <ul>
            <li>Layout: {{ displaySetting(layoutItems, layout) }}</li>
            <li>
              Button layout:
              {{ displaySetting(compactnessItems, compactness) }}
            </li>
          </ul>
        </settings-page-preview>
        <settings-page-preview
          section="downloads"
          ref="downloads"
          title="Downloads"
          icon="mdi-download"
          color="darken-1 cyan"
          text="Change settings related to downloads."
        >
          <ul>
            <li>
              Descriptive names: {{ displaySetting(descriptiveFilenames) }}
            </li>
            <li>
              Concurrent downloads: {{ displaySetting(concurrentDownloads) }}
            </li>
          </ul>
        </settings-page-preview>
        <settings-page-preview
          section="loading"
          ref="loading"
          title="Loading"
          icon="mdi-widgets"
          color="darken-1 orange"
          text="Change how posts are loaded."
        >
          <ul>
            <li>Page size: {{ displaySetting(postSlider) }}</li>
            <li>Mobile: {{ displaySetting(lowRes) }}</li>
            <li>Full resolution: {{ displaySetting(fastLoad) }}</li>
            <li>Bottom load: {{ displaySetting(bottomLoad) }}</li>
            <li>Initial page load: {{ displaySetting(autoLoad) }}</li>
            <li>Pagination: {{ displaySetting(pagination) }}</li>
          </ul>
        </settings-page-preview> -->
        <!-- <settings-page-preview section="search" ref="search" title="Search" icon="mdi-magnify" color="darken-1 blue"
            text="Change settings related to search.">
            <ul>
            </ul>
          </settings-page-preview>-->

        <!-- <settings-page-preview
          section="tags"
          ref="tags"
          title="Tags"
          icon="mdi-tag-multiple"
          color="darken-1 purple"
          :text="`Change how ${$appName} suggests tags.`"
        >
          <ul>
            <li>Suggestion count: {{ displaySetting(suggestionSlider) }}</li>
            <li>Tag count per fetch: {{ displaySetting(tagSlider) }}</li>
          </ul>
        </settings-page-preview>
        <settings-page-preview
          section="backup"
          ref="backup"
          title="Backup, restore and synchronize"
          icon="mdi-backup-restore"
          color="darken-1 light-green"
          text="Download or import settings and change how they are synchronized between tabs."
        >
          <ul></ul>
        </settings-page-preview>
        <settings-page-preview
          section="other"
          ref="other"
          title="Other"
          icon="mdi-dots-horizontal"
          color="darken-1 indigo"
          text="Toggle the DText parser."
        >
          <ul>
            <li>DText parser: {{ displaySetting(enableDtext) }}</li>
          </ul>
        </settings-page-preview> -->
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
