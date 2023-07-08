<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="API & Account" color="darken-3 yellow" />
        <settings-page-item title="Credentials" select>
          <v-text-field filled label="e621 username" type="text" v-model="username" autocomplete="username" />
          <v-text-field filled :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'" label="e621 API key" v-model="apiKey"
            @click:append="showPassword = !showPassword" autocomplete="password" />
          <p class="text-left">
            Go to <external-link :href="`${e621Url}users/home`" /> > Manage API Access to get the API key
          </p>
          <v-btn :disabled="!username" color="accent" text @click="toggleFavoritesMenuItem">
            {{ usernameSavedSearchExists ? `Remove "Favorites" saved search` : `Add "Favorites" saved search` }}
          </v-btn>
        </settings-page-item>
        <settings-page-item title="API" select>
          <v-select filled label="e621 API" type="text" v-model="e621Url"
            :items="['https://e621.net/', 'https://e926.net/']" />
          <v-text-field filled label="Favorites API" type="text" v-model="proxyUrl" autocomplete="url" />
          <p class="text-left">
            Material e621 uses the regular e621 API as much as possible, but the
            favorites endpoints don't have the required cross origin resource
            sharing headers in order to use them directly in the browser. This
            is why adding and removing favorites uses this API:
            <external-link href="https://github.com/avoonix/material-e621-proxy" />
          </p>
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import { computed, defineComponent, ref } from "vue";
import ExternalLink from "@/App/ExternalLink.vue";
import { useAccountStore, useSavedSearchStore, useUrlStore } from "@/services";
import { SavedSearchEntry } from "@/services/types";

export default defineComponent({
  metaInfo: {
    title: "Account Settings",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
    ExternalLink,
  },
  setup() {
    const account = useAccountStore();
    const url = useUrlStore();
    const showPassword = ref(false);

    const username = computed<string>({
      get() {
        return account.username || "";
      },
      set(value) {
        account.username = value ? value : null;
      },
    });

    const apiKey = computed<string>({
      get() {
        return account.apiKey || "";
      },
      set(value) {
        account.apiKey = value ? value : null;
      },
    });

    const e621Url = computed<string>({
      get() {
        return url.e621Url
      },
      set(value) {
        url.e621Url = value;
      },
    });

    const proxyUrl = computed<string>({
      get() {
        return url.proxyUrl
      },
      set(value) {
        url.proxyUrl = value;
      },
    });

    const findSavedSearch = (e: SavedSearchEntry) => e.tags.length === 1 && e.tags[0] === usernameSavedSearchTag.value;
    const savedSearches = useSavedSearchStore();
    const usernameSavedSearchTag = computed(() => `fav:${username.value}`);
    const usernameSavedSearchExists = computed(() =>
      !!savedSearches.entries.find(findSavedSearch)
    )

    const toggleFavoritesMenuItem = () => {
      if (usernameSavedSearchExists.value) {
        savedSearches.deleteEntry(savedSearches.entries.findIndex(findSavedSearch))
      } else {
        savedSearches.addEntry([usernameSavedSearchTag.value], `Favorites (${username.value})`)
      }
    }

    return {
      toggleFavoritesMenuItem,
      usernameSavedSearchExists,
      showPassword,
      username,
      apiKey,
      e621Url,
      proxyUrl,
    };
  },
});
</script>
