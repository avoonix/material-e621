<template>
  <v-responsive height="100%">
    <v-container fill-height>
      <v-layout align-center>
        <v-flex text-center>
          <app-logo type="face" />
          <h3 class="text-h2">Page not found</h3>
          <v-btn color="primary" large :to="{ path: '/' }"> Start page </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-responsive>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppLogo from "../App/AppLogo.vue";

export default defineComponent({
  components: {
    AppLogo,
  },
});
</script>
