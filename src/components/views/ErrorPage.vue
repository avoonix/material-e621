<template>
  <v-responsive height="100%">
    <v-container fill-height>
      <v-layout align-center>
        <v-flex text-xs-center>
          <logo mascot />
          <h3 class="display-3">Page not found</h3>
          <v-btn color="primary" large @click="goHome">Start page</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-responsive>
</template>
<script>
import Logo from "../Logo.vue";

export default {
  components: {
    Logo,
  },
  methods: {
    goHome() {
      this.$router.push({
        path: "/e621",
        query: this.$store.state.routerModule.query,
      });
    },
  },
};
</script>
