<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Account" color="darken-3 yellow" />
        <settings-page-item title="Credentials" select>
          <v-text-field
            box
            label="e621 username"
            type="text"
            v-model="username"
            autocomplete="username"
          />
          <v-text-field
            box
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            label="e621 API key"
            v-model="apiKey"
            @click:append="showPassword = !showPassword"
            autocomplete="password"
          />
        </settings-page-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import { computed, defineComponent, ref } from "@vue/composition-api";
import { accountService } from "@/services";

export default defineComponent({
  metaInfo: {
    title: "Account Settings",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
  },
  setup() {
    const showPassword = ref(false);

    const username = computed<string>({
      get() {
        return accountService.username || "";
      },
      set(value) {
        accountService.username = value ? value : null;
      },
    });

    const apiKey = computed<string>({
      get() {
        return accountService.apiKey || "";
      },
      set(value) {
        accountService.apiKey = value ? value : null;
      },
    });

    return {
      showPassword,
      username,
      apiKey,
    };
  },
});
</script>
