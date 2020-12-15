<template>
  <v-responsive height="100%">
    <v-container fill-height>
      <v-layout align-center>
        <v-flex text-xs-center>
          <logo mascot />
          <h3 class="display-3">Page not found</h3>
          <v-btn color="primary" large :to="{ path: '/e621' }">
            Start page
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-responsive>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Logo from "./Logo.vue";

export default defineComponent({
  components: {
    Logo,
  },
});
</script>
