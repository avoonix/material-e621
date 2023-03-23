<template>
  <v-flex>
    <section
      :class="`theme--${isDark ? 'dark' : 'light'}`"
      class="v-toolbar elevation-0 primary d-flex"
      :style="{ height: '75vh' }"
    >
      <v-layout column align-center justify-center fill-height class="">
        <app-logo type="face" size="200" />
        <h1 class="mb-2 text-h1 text-center">Material e621</h1>
        <div class="text-h5">A {{ adjective }} frontend for e621.net</div>
        <div class="ma-5">
          <v-btn x-large color="secondary" outlined :to="{ path: '/posts' }">
            Browse posts
          </v-btn>
        </div>
      </v-layout>
    </section>
    <section class="mt-8 mb-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <div class="mb-3">
              <h2 class="text-h4 text-center">What is Material e621?</h2>
            </div>
            <p class="text-center">
              Material e621 is a modern, open source web client for e621.net. It
              is customizable, comes with a bunch of features that are not
              available on e621.net, and makes browsing posts a delightful
              experience.
            </p>
            <p class="text-center">
              Further information can be found on the project's
              <a
                class="primary--text text-decoration-none"
                target="_blank"
                href="https://github.com/avoonix/material-e621/issues"
              >
                <v-icon color="primary" size="1em" class="mr-1">
                  mdi-open-in-new </v-icon
                ><span class="text-decoration-underline">GitHub page</span></a
              >.
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <div class="mb-3">
              <h2 class="text-h4 text-center">Looking for more?</h2>
            </div>
            <p class="text-center">
              The original site can be found
              <a
                class="primary--text text-decoration-none"
                target="_blank"
                :href="url.e621Url"
              >
                <v-icon color="primary" size="1em" class="mr-1">
                  mdi-open-in-new </v-icon
                ><span class="text-decoration-underline">here</span></a
              >. While Material e621 provides an enhanced interface for browsing
              posts, e621.net has more features that go beyond that, such as
              image uploads, comments, and a forum (among others). If you need
              any of those, use e621.net directly as most of these features will
              never be available in Material e621.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section class="ma-1">
      <v-layout justify-center wrap>
        <v-flex xs12 class="pt-5">
          <div class="text-center">
            <h2 class="text-h4">Latest updates</h2>
          </div>
        </v-flex>
        <v-flex xs12 md6 xl4 class="py-5">
          <commit-timeline dense :limit="3" />
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
import { computed, defineComponent, inject } from "vue";
import AppLogo from "../App/AppLogo.vue";
import CommitTimeline from "@/About/CommitTimeline.vue";
import { useUrlStore } from "@/services";

const chooseRandom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export default defineComponent({
  components: {
    AppLogo,
    CommitTimeline,
  },
  setup() {
    const theme = inject<{ isDark: boolean }>("theme");
    const isDark = computed(() => !!theme?.isDark);

    const adjective = chooseRandom([
      "modern",
      "delightful",
      "customizable",
      "stylish",
      "handy",
    ]);

    const url = useUrlStore();

    return {
      isDark,
      adjective,
      url,
    };
  },
});
</script>
