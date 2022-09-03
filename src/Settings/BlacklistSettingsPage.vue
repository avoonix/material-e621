<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Blacklist" color="darken-1 red" />
        <settings-page-item title="Mode" select>
          <v-select
            :items="modeItems"
            outlined
            hide-details
            v-model="mode"
          />
        </settings-page-item>
        <settings-page-item title="Custom tags" select>
          <tag-search
            :tags="blacklist"
            @add-tag="addTag"
            @remove-tag="removeTag"
          />
        </settings-page-item>
        <settings-page-item title="Frequently blacklisted tags" select>
          <blacklist-suggestions
            :tags="suggestions"
            :blacklisted="blacklist"
            @add-tag="addTag"
            @remove-tag="removeTag"
          />
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import BlacklistSuggestions from "./BlacklistSuggestions.vue";
import { computed, defineComponent } from "vue";
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

    return {
      modeItems,
      mode,
      suggestions: blacklistSuggestions,
      blacklist,
      addTag: (tag: string) => blacklistStore.addTag(tag),
      removeTag: (tag: string) => blacklistStore.removeTag(tag),
    };
  },
});
</script>
