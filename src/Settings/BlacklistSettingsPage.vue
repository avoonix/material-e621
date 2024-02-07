<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Blacklist" color="darken-1 red" />
        <settings-page-item title="Mode" select>
          <v-select :items="modeItems" outlined hide-details v-model="mode" />
        </settings-page-item>
        <settings-page-item title="Hide server-side blacklisted posts" description="Unless you are logged in, any posts containing the tag young and a rating other than safe is blacklisted" switch>
          <v-switch v-model="blacklistStore.hideServerSideBlacklisted" />
        </settings-page-item>
        <settings-page-item title="Custom blacklist" select>
          <p>
            Blacklisting works similarly to e621, but meta tags (except rating:)
            don't fully work.
          </p>
          <!-- always empty list at the end to add new line -->
          <div v-for="(tags, index) in [...blacklist, []]" :key="index">
            <tag-search
              outlined
              :search-filters="false"
              class="mb-1"
              :tags="tags"
              @add-tag="addTag(index, $event)"
              @remove-tag="removeTag(index, $event)"
            />
          </div>
        </settings-page-item>
        <settings-page-item title="Frequently blacklisted tags" select>
          <blacklist-suggestions
            :tags="suggestions"
            :blacklisted="blacklist"
            @add-tag="addTag(blacklist.length, $event)"
            @remove-tag="removeTag"
          />
        </settings-page-item>

        <settings-page-item title="e621 blacklist import" select>
          <v-textarea
            outlined
            :rows="6"
            v-model="blacklistImport"
            label="Paste blacklist here"
            hide-details
          />
          <v-btn text class="mt-1" @click="doImport"> Import </v-btn>
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import BlacklistSuggestions from "./BlacklistSuggestions.vue";
import { computed, defineComponent, ref } from "vue";
import blacklistSuggestions from "@/misc/data/blacklistSuggestions.json";
import TagSearch from "../Tag/TagSearch.vue";
import { BlacklistMode } from "@/services/types";
import { useBlacklistStore } from "@/services";

export default defineComponent({
  metaInfo: {
    title: "Blacklist Settings",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
    BlacklistSuggestions,
    TagSearch,
  },
  setup() {
    const blacklistStore = useBlacklistStore();
    const modeItems = computed(() => [
      {
        text: "Hide",
        value: BlacklistMode.hide,
      },
      {
        text: "Blur",
        value: BlacklistMode.blur,
      },
      {
        text: "Blackout",
        value: BlacklistMode.blackout,
      },
    ]);

    const mode = computed<BlacklistMode>({
      get() {
        return blacklistStore.mode;
      },
      set(value) {
        blacklistStore.mode = value;
      },
    });

    const blacklist = computed(() => blacklistStore.tags);

    const blacklistImport = ref("");
    const doImport = () => {
      const bl = blacklistImport.value.split("\n").map(line => line.trim().split(" ").map(tag => tag.trim()));
      for (const line of bl) {
        const exists = !!blacklist.value.find(l => l.join(" ") === line.join(" "));
        if (exists) continue;
        const index = blacklist.value.length;
        for (const tag of line) {
          blacklistStore.addTag(index, tag);
        }
      }
    };

    return {
      blacklistStore,
      modeItems,
      mode,
      suggestions: blacklistSuggestions,
      blacklist,
      addTag: (index: number, tag: string) => blacklistStore.addTag(index, tag),
      removeTag: (index: number, tag: string) =>
        blacklistStore.removeTag(index, tag),
      blacklistImport,
      doImport,
    };
  },
});
</script>
