<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
        <settings-page-title section="history" title="History & Saved Searches" color="green-darken-1" />
        <settings-page-item title="Saved Searches" select>
          <saved-search-list :entries="savedSearches" @delete-entry="deleteSavedSearch($event)"
            @click-entry="openSearch($event)" />
        </settings-page-item>
        <settings-page-item title="Max history length" select>
          <v-text-field type="number" v-model.number.lazy="maxLength" />
        </settings-page-item>
        <settings-page-item title="History" select>
          <history-list :entries="entries" @delete-entry="deleteEntry($event)" @click-entry="openSearch($event)" />
        </settings-page-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import HistoryList from "../Tag/HistoryList.vue";
import { computed, defineComponent } from "vue";
import { useHistoryStore, useSavedSearchStore } from "@/services";
import SavedSearchList from "@/Tag/SavedSearchList.vue";
import { useHead } from "@unhead/vue";
import { useRouter } from "vue-router";

useHead({ title: "History" });

const router = useRouter();

const history = useHistoryStore();
const savedSearchesStore = useSavedSearchStore();
const openSearch = async (tags: string[]) => {
  router.push({
    name: "Posts",
    query: {
      tags: tags.join(" "),
    },
  });
};
const entries = history.entries;
const savedSearches = savedSearchesStore.entries;
const deleteSavedSearch = (idx: number) => savedSearchesStore.deleteEntry(idx);
const deleteEntry = (idx: number) => history.deleteEntry(idx);
const maxLength = computed<number>({
  get() {
    return history.maxLength;
  },
  set(value) {
    history.maxLength = value;
  },
});
</script>
