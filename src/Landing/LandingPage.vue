<template>
  <section class="v-toolbar elevation-0 bg-primary d-flex" :style="{ height: '75vh' }">
    <div class="w-100 d-flex flex-column align-center justify-center fill-height">

      <app-logo v-view-transition-name="'applogo'" type="face" size="200" />
      <h1 class="mb-2 text-h1 text-center">Material e621</h1>
      <div class="text-h5">A {{ adjective }} frontend for e621.net</div>
      <div style="min-width: 50vw;">
        <tag-search v-view-transition-name="'tagsearch'" style="flex: 1 1 auto" :tags="tags" @add-tag="addTag"
          @remove-tag="removeTag" @confirm-search="router.push(query)" label="Search Tags ..." />
      </div>
      <div class="ma-5">
        <v-btn size="x-large" color="secondary" variant="outlined" :to="query">
          Browse posts
        </v-btn>
      </div>
    </div>
  </section>
  <MigrationInfo />
  <About />
  <section class="ma-1">
    <v-row wrap justify="center" align="center">
      <v-col cols="12" class="pt-5">
        <div class="text-center">
          <h2 class="text-h4">Latest updates</h2>
        </div>
      </v-col>
      <v-col cols="12" md="6" xl="4" class="py-5">
        <commit-timeline dense :limit="3" />
        <v-btn block class="mt-0" color="primary" to="/about"> more </v-btn>
      </v-col>
    </v-row>
  </section>
  <Footer />
</template>

<script setup lang="ts">
import AppLogo from "../App/AppLogo.vue";
import CommitTimeline from "@/About/CommitTimeline.vue";
import { useHead } from "@unhead/vue";
import TagSearch from "@/Tag/TagSearch.vue";
import About from "./About.vue";
import Footer from "./Footer.vue";
import { computed, ref } from "vue";
import { useRouter, type RouteLocationRaw } from "vue-router";
import MigrationInfo from "./MigrationInfo.vue";

const router = useRouter();

const chooseRandom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

useHead({
  title: "Material e621",
  titleTemplate: null,
});

const adjective = chooseRandom([
  "modern",
  "delightful",
  "customizable",
  "stylish",
  "handy",
]);

const tags = ref<string[]>([]);
const query = computed<RouteLocationRaw>(() => ({
  name: "Posts",
  query: { tags: tags.value.join(" ") },
}));
const addTag = (tag: string) => tags.value.push(tag);
const removeTag = (tag: string) => tags.value.splice(tags.value.indexOf(tag), 1);
</script>
