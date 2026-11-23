<template>
  <v-responsive height="100%">
    <v-container class="fill-height d-flex align-center flex-wrap">
      <v-row>
        <v-col class="text-center">
          <app-logo type="face" />
          <h3 class="text-display-medium">Page not found</h3>
          <v-btn color="primary" size="large" :to="{ name: 'LandingPage' }"> Start page </v-btn>
        </v-col>
      </v-row>
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
