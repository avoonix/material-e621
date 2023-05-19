<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="History & Saved Searches" color="darken-1 green" />
        <settings-page-item title="Saved Searches" select>
          <saved-search-list :entries="savedSearches" @delete-entry="deleteSavedSearch($event)" @click-entry="openSearch($event)" />
        </settings-page-item>
        <settings-page-item title="Max history length" select>
          <v-text-field type="number" v-model.number.lazy="maxLength" />
        </settings-page-item>
        <settings-page-item title="History" select>
          <history-list :entries="entries" @delete-entry="deleteEntry($event)" @click-entry="openSearch($event)" />
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import HistoryList from "../Tag/HistoryList.vue";
import { computed, defineComponent } from "vue";
import { useHistoryStore, useSavedSearchStore } from "@/services";
import SavedSearchList from "@/Tag/SavedSearchList.vue";

export default defineComponent({
  metaInfo: {
    title: "History",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
    HistoryList,
    SavedSearchList
  },
  setup(props, context) {
    const history = useHistoryStore();
    const savedSearches = useSavedSearchStore();
    const openSearch = async (tags: string[]) => {
      const { appRouter } = await import("@/misc/util/router");
      appRouter.push({
        name: "Posts",
        query: {
          tags: tags.join(" "),
        },
      });
    };
    return {
      openSearch,
      entries: history.entries,
      savedSearches: savedSearches.entries,
      deleteSavedSearch: (idx: number) => savedSearches.deleteEntry(idx),
      deleteEntry: (idx: number) => history.deleteEntry(idx),
      maxLength: computed<number>({
        get() {
          return history.maxLength;
        },
        set(value) {
          history.maxLength = value;
        },
      }),
    };
  },
});
</script>
