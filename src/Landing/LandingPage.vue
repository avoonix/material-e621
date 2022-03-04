<template>
  <v-flex>
    <section
      :class="`theme--${isDark ? 'dark' : 'light'}`"
      class="v-toolbar elevation-2 primary d-flex"
      :style="{ height: '85vh' }"
    >
      <v-layout column align-center justify-center fill-height class="">
        <app-logo type="face" size="200" />
        <h1 class="mb-2 text-h1 text-center">Material e621</h1>
        <div class="text-h5">e621 client</div>
        <div class="ma-5">
          <v-btn large color="accent" :to="{ path: '/posts' }">
            Start browsing
          </v-btn>
          <!-- TODO: -->
          <!-- <v-btn
            large
            color="accent"
            :to="{
              path: '/settings/setup/1',
              query: $store.state.routerModule.query,
            }"
          >
            View the introduction
          </v-btn> -->
        </div>
      </v-layout>
    </section>
    <section class="ma-1">
      <v-layout justify-center wrap>
        <v-flex xs12 class="pt-5">
          <div class="text-center">
            <h2 class="text-h5">Latest update</h2>
          </div>
        </v-flex>
        <v-flex xs12 md6 xl4 class="py-5">
          <!-- <changelog-item class="" :item="latestChange" /> -->
          <commit-timeline dense :limit="1" />
          <v-btn block class="mt-0" color="primary" to="/about"> more </v-btn>
        </v-flex>
      </v-layout>
    </section>
    <v-footer class="primary">
      <v-layout wrap="" align-center>
        <v-flex xs12>
          <v-spacer />
          <div class="white--text ml-3">
            Made with
            <v-icon title="Vue" size="18" class="green--text">mdi-vuejs</v-icon>
            by
            <a href="https://avoonix.com/" class="white--text" title="Avoonix">
              Avoo
            </a>
          </div>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-flex>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from "@vue/composition-api";
import AppLogo from "../App/AppLogo.vue";
import CommitTimeline from "@/About/CommitTimeline.vue";

export default defineComponent({
  components: {
    AppLogo,
    CommitTimeline,
  },
  setup() {
    const theme = inject<{ isDark: boolean }>("theme");
    const isDark = computed(() => !!theme?.isDark);
    return {
      isDark,
    };
  },
});
</script>
