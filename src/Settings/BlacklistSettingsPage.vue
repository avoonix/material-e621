<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
        <settings-page-title section="blacklist" title="Blacklist" color="red-darken-1" />
        <settings-page-item title="Mode" select>
          <v-select :items="modeItems" variant="outlined" hide-details v-model="mode" />
        </settings-page-item>
        <settings-page-item title="Hide server-side blacklisted posts"
          description="Unless you are logged in, any posts containing the tag young and a rating other than safe is blacklisted"
          switch>
          <v-switch v-model="blacklistStore.hideServerSideBlacklisted" />
        </settings-page-item>
        <settings-page-item title="Frequently blacklisted tags" select>
          <blacklist-suggestions :tags="suggestions" :blacklisted="blacklist"
            @add-tag="addTag(blacklist.length, $event)" @remove-tag="removeTag" />
        </settings-page-item>
        <settings-page-item title="Custom blacklist" select>
          <p>
            Blacklisting works similarly to e621, but meta tags (except rating:)
            don't fully work.
          </p>
          <!-- always empty list at the end to add new line -->
          <div v-for="(tags, index) in [...blacklist, []]" :key="index">
            <tag-search outlined :search-filters="false" class="mb-1" :tags="tags" @add-tag="addTag(index, $event)"
              @remove-tag="removeTag(index, $event)" />
          </div>
        </settings-page-item>
        <settings-page-item title="e621 blacklist import" select>
          <v-textarea variant="outlined" :rows="6" v-model="blacklistImport" label="Paste blacklist here"
            hide-details />
          <v-btn variant="text" class="mt-1" @click="doImport"> Import </v-btn>
        </settings-page-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import BlacklistSuggestions from "./BlacklistSuggestions.vue";
import { computed, defineComponent, ref } from "vue";
import blacklistSuggestions from "@/misc/data/blacklistSuggestions.json";
import TagSearch from "../Tag/TagSearch.vue";
import { BlacklistMode } from "@/services/types";
import { useBlacklistStore } from "@/services";
import { useHead } from "@unhead/vue";

useHead({ title: "Blacklist Settings", });

const blacklistStore = useBlacklistStore();
const modeItems = computed(() => [
  {
    title: "Hide",
    value: BlacklistMode.hide,
  },
  {
    title: "Blur",
    value: BlacklistMode.blur,
  },
  {
    title: "Blackout",
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

const suggestions = blacklistSuggestions;
const addTag = (index: number, tag: string) => blacklistStore.addTag(index, tag);
const removeTag = (index: number, tag: string) =>
  blacklistStore.removeTag(index, tag);
</script>
