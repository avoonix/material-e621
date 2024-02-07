<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="API & Account" color="darken-3 yellow" />
        <settings-page-item title="Credentials" select>
          <v-text-field filled label="e621 username" type="text" v-model="username" autocomplete="username" />
          <v-text-field filled :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'" label="e621 API key" v-model="apiKey"
            @click:append="showPassword = !showPassword" autocomplete="password" counter="24" />
          <p class="text-left">
            Go to <external-link :href="`${e621Url}users/home`" /> > Manage API Access to get the API key
          </p>
          <div>
              <v-btn :disabled="!username || !apiKey" :loading="verification.loading" :color="verification.success ? 'success' : verification.message ? 'error' : 'accent'" text @click="verifyCredentials">
                  Verify credentials
              </v-btn>
              <p v-if="verification.message">
                  {{ verification.message }}
              </p>
              <p class="text-left" v-if="!verification.success && verification.message">
                  A network error means that <i>something</i> did not work. 
                  Most likely, this was an authentication error. Double check if the username is exactly the same as on <external-link :href="`${e621Url}users/home`" /> and make sure you copied the API key correctly - it should be 24 characters long.
                  <br />
                  Due to a security policy (CORS), Material e621 cannot determine the cause of the error. There might be a general error with the network or e621.
              </p>
          </div>
          <v-btn class="mt-4" :disabled="!username" color="accent" text @click="toggleFavoritesMenuItem">
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
import { computed, defineComponent, ref, watch } from "vue";
import ExternalLink from "@/App/ExternalLink.vue";
import { useAccountStore, useSavedSearchStore, useUrlStore } from "@/services";
import { SavedSearchEntry } from "@/services/types";
import { getApiService } from "@/worker/services";
import { BlacklistMode } from "@/services/types";

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

    const verification = ref({
        success: false,
        loading: false,
        message: "",
    });
    const verifyCredentials = async () => {
        verification.value.loading = true;
        try {
            const service = await getApiService();
            const posts = await service.getPosts({
              page: 1,
              limit: 1,
              tags: ["rating:s"],
              blacklist: [],
              blacklistMode: BlacklistMode.hide,
              auth: account.auth,
              baseUrl: url.e621Url
            });
            verification.value.success = true;
            verification.value.message = "Credentials are valid";
        } catch (e: any) {
            console.dir(e);
            verification.value.success = false;
            verification.value.message = `Credentials are invalid: ${e.message || e}`;
        } finally {
            verification.value.loading = false;
        }
    };

    watch(username, () => {
      verification.value.message = "";
      verification.value.success = false;
    });
    watch(apiKey, () => {
      verification.value.message = "";
      verification.value.success = false;
    });

    return {
      toggleFavoritesMenuItem,
      usernameSavedSearchExists,
      showPassword,
      username,
      apiKey,
      e621Url,
      proxyUrl,
      verification,
      verifyCredentials,
    };
  },
});
</script>
