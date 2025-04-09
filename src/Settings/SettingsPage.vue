<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
        <v-card>
          <v-list>
            <settings-page-section section="info" title="Info" icon="mdi-information" color="teal-darken-2">
              <v-list-item-subtitle>
                Last update was {{ lastUpdated }}
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="blacklist" title="Blacklist" icon="mdi-playlist-remove"
              color="red-darken-1">
              <v-list-item-subtitle>
                {{ blacklistCount }} blacklist
                {{ blacklistCount === 1 ? "entry" : "entries" }}
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="appearance" title="Appearance" icon="mdi-palette" color="pink-darken-1" />
            <settings-page-section section="history" title="History & Saved Searches" icon="mdi-format-list-bulleted"
              color="green-darken-1">
              <v-list-item-subtitle>
                {{ historySize }}
                {{ historySize === 1 ? "entry" : "entries" }}
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="posts" title="Posts" icon="mdi-format-list-text" color="brown-darken-3" />
            <settings-page-section section="account" title="API & Account" icon="mdi-account" color="yellow-darken-3">
              <v-list-item-subtitle v-if="username">
                Signed in as {{ username }}
              </v-list-item-subtitle>
            </settings-page-section>
            <settings-page-section section="restore" title="Backup and Restore" icon="mdi-backup-restore"
              color="blue-darken-1" />
            <settings-page-section section="shortcuts" title="Keyboard Shortcuts" icon="mdi-keyboard" color="black">
              <v-list-item-subtitle>
                {{ shortcutCount }}
                {{ shortcutCount === 1 ? "shortcut" : "shortcuts" }} defined
              </v-list-item-subtitle>
            </settings-page-section>
          </v-list>
        </v-card>

        <v-card class="mt-3" v-if="githubInfoVisible">
          <v-card-title class="pb-1 pt-2">
            Found a bug or got an idea for a new feature?
          </v-card-title>
          <v-card-text class="py-0">
            Create, comment on, or react to issues on the Material e621 GitHub page!
          </v-card-text>
          <v-card-actions class="pb-2">
            <v-spacer />
            <v-btn @click="hideGithubInfo" size="small" variant="outlined" color="primary">
              Never show again
            </v-btn>
            <v-btn size="small" variant="outlined" color="primary" target="_blank"
              href="https://github.com/avoonix/material-e621/issues">
              <v-icon start> mdi-open-in-new </v-icon>
              browse issues
            </v-btn>
            <v-btn size="small" variant="outlined" color="primary" target="_blank"
              href="https://github.com/avoonix/material-e621/issues/new/choose">
              <v-icon start> mdi-open-in-new </v-icon>
              create issue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { getGitInfo } from "@/misc/util/git";
import { useAccountStore, useAppearanceStore, useBlacklistStore, useHistoryStore, useShortcutStore } from "@/services";
import { computed, defineComponent, onMounted } from "vue";
import { formatDistanceToNow } from "date-fns";
import SettingsPageSection from "./SettingsPageSection.vue";
import { useHead } from "@unhead/vue";

useHead({ title: "Settings", });

const history = useHistoryStore();
const blacklist = useBlacklistStore();
const account = useAccountStore();
const shortcuts = useShortcutStore();
const appearance = useAppearanceStore();

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

const hideGithubInfo = () => appearance.hideGithubInfo = true;
const githubInfoVisible = computed(() => !appearance.hideGithubInfo)

</script>
