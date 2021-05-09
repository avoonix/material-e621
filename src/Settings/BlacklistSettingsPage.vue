<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Blacklist" color="darken-1 red" />
        <settings-page-item title="Mode" select>
          <v-select :items="modeItems" box solo hide-details v-model="mode" />
        </settings-page-item>
        <settings-page-item title="Frequently blacklisted tags" select>
          <blacklist-suggestions
            :tags="suggestions"
            :blacklisted="blacklist"
            @add-tag="addTag"
            @remove-tag="removeTag"
          />
        </settings-page-item>
        <settings-page-item title="Custom tags" select>
          <tag-search
            :tags="blacklist"
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
import BlacklistSuggestions from "../components/updated/dumb/BlacklistSuggestions.vue";
import { blacklistService } from "@/services";
import { computed, defineComponent } from "@vue/composition-api";
import blacklistSuggestions from "@/config/blacklistSuggestions.json";
import TagSearch from "../components/updated/smart/TagSearch.vue";
import { BlacklistMode } from "@/services/types";

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
        return blacklistService.mode;
      },
      set(value) {
        blacklistService.mode = value;
      },
    });

    const blacklist = computed(() => blacklistService.tags);

    return {
      modeItems,
      mode,
      suggestions: blacklistSuggestions,
      blacklist,
      addTag: (tag: string) => blacklistService.addTag(tag),
      removeTag: (tag: string) => blacklistService.removeTag(tag),
    };
  },
});
</script>
