<template>
  <v-flex>
    <section
      :class="`theme--${theme.isDark ? 'dark' : 'light'}`"
      class="v-toolbar elevation-2 primary d-flex"
      :style="{ height: '85vh' }"
    >
      <v-layout column align-center justify-center fill-height class="">
        <logo mascot />
        <h1 class="mb-2 display-4 text-xs-center">Material e621</h1>
        <div class="headline">e621 client</div>
        <div class="ma-5">
          <v-btn
            large
            color="accent"
            :to="{ path: '/e621', query: $store.state.routerModule.query }"
            >Start browsing</v-btn
          >
          <v-btn
            large
            color="accent"
            :to="{
              path: '/settings/setup/1',
              query: $store.state.routerModule.query,
            }"
          >
            View the introduction
          </v-btn>
        </div>
      </v-layout>
    </section>
    <section>
      <v-layout column wrap="" class="my-5 py-5" align-center>
        <v-flex xs12 class="">
          <div class="text-xs-center">
            <h2 class="headline">Latest news</h2>
          </div>
        </v-flex>
        <v-flex class="ma-5">
          <changelog-item class="" :item="latestChange" />
        </v-flex>
        <v-flex xs12>
          <v-btn
            large
            color="primary"
            :to="{ path: '/about', query: $store.state.routerModule.query }"
            >View all changes</v-btn
          >
        </v-flex>
      </v-layout>
    </section>
    <v-footer class="primary">
      <v-layout row wrap="" align-center>
        <v-flex xs12>
          <v-spacer />
          <div class="white--text ml-3">
            Made with <v-icon size="20" class="red--text">mdi-heart</v-icon>and
            <v-icon size="20" class="green--text">mdi-vuejs</v-icon>
          </div>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-flex>
</template>

<script>
import ChangelogItem from "../components/ChangelogItem.vue";
import Logo from "../components/updated/dumb/Logo.vue";
import changelog from "../config/changelog";

export default {
  inject: ["theme"],
  components: {
    ChangelogItem,
    Logo,
  },
  computed: {
    latestChange() {
      const changes = changelog.filter((c) => c.large);
      return changes[changes.length - 1];
    },
  },
};
</script>
