<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex xs12 sm10 offset-sm1 lg6 offset-lg3>
        <v-card>
          <v-list class="secondary">
            <settings-page-section section="info" title="Info" icon="mdi-information" color="darken-2 teal">
              <v-list-item-subtitle>
                Last update was {{ lastUpdated }}
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="blacklist" title="Blacklist" icon="mdi-playlist-remove"
              color="darken-1 red">
              <v-list-item-subtitle>
                {{ blacklistCount }}
                {{ blacklistCount === 1 ? "tag" : "tags" }} blacklisted
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="appearance" title="Appearance" icon="mdi-palette" color="darken-1 pink" />
            <settings-page-section section="history" title="History" icon="mdi-format-list-bulleted"
              color="darken-1 green">
              <v-list-item-subtitle>
                {{ historySize }}
                {{ historySize === 1 ? "entry" : "entries" }}
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="posts" title="Posts" icon="mdi-format-list-text" color="darken-3 brown" />
            <settings-page-section section="account" title="Account" icon="mdi-account" color="darken-3 yellow">
              <v-list-item-subtitle v-if="username">
                Signed in as {{ username }}
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="restore" title="Backup and Restore" icon="mdi-backup-restore"
              color="darken-1 blue" />
            <settings-page-section section="shortcuts" title="Keyboard Shortcuts" icon="mdi-keyboard" color="black">
              <v-list-item-subtitle>
                {{ shortcutCount }}
                {{ shortcutCount === 1 ? "shortcut" : "shortcuts" }} defined
              </v-list-item-subtitle>
            </settings-page-section>
          </v-list>
        </v-card>

        <v-card color="secondary" class="mt-3">
          <v-card-title class="pb-1 pt-2">
            Found a bug or got an idea for a new feature?
          </v-card-title>
          <v-card-text class="py-0">
            Create, comment on, or react to issues on the Material e621 GitHub page!
          </v-card-text>
          <v-card-actions class="pb-2">
            <v-spacer />
            <v-btn small outlined color="primary" target="_blank"
              href="https://github.com/avoonix/material-e621/issues">
              <v-icon left> mdi-open-in-new </v-icon>
              browse issues
            </v-btn>
            <v-btn small outlined color="primary" target="_blank"
              href="https://github.com/avoonix/material-e621/issues/new/choose">
              <v-icon left> mdi-open-in-new </v-icon>
              create issue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { getGitInfo } from "@/misc/util/git";
import { useAccountStore, useBlacklistStore, useHistoryStore, useShortcutStore } from "@/services";
import { computed, defineComponent, onMounted } from "vue";
import { formatDistanceToNow } from "date-fns";
import SettingsPageSection from "./SettingsPageSection.vue";

export default defineComponent({
  metaInfo: {
    title: "Settings",
  },
  components: {
    SettingsPageSection,
  },
  setup() {
    const history = useHistoryStore();
    const blacklist = useBlacklistStore();
    const account = useAccountStore();
    const shortcuts = useShortcutStore();
    onMounted(() => {
      window.scrollTo({ top: 0 });
    });

    const lastUpdated = computed(() =>
      formatDistanceToNow(getGitInfo()[0].date, { addSuffix: true }),
    );

    const historySize = computed(() => history.entries.length);

    const blacklistCount = computed(() => blacklist.tags.length);

    const username = computed(() => account.username);

    const shortcutCount = computed(() => shortcuts.shortcuts.length);

    return {
      lastUpdated,
      historySize,
      blacklistCount,
      username,
      shortcutCount,
    };
  },
});
</script>
