<template>
  <v-menu bottom offset-y left attach close-delay="0">
    <v-btn slot="activator" icon>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
    <v-list>
      <v-subheader v-if="username">Logged in as {{ username }}</v-subheader>
      <v-list-tile :to="{ name: 'AccountSettings' }">
        <v-list-tile-title>Account settings</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { accountService } from "@/services";
import { computed, defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {},
  setup(props, context) {
    const username = computed(() => accountService.username);

    return {
      username,
    };
  },
});
</script>
