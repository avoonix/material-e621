<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col cols="12">
        <commit-timeline :dense="smAndDown" />
        <div class="d-flex justify-center">
          <v-btn class="mt-0" color="primary" href="https://github.com/avoonix/material-e621/commits/master">
            view older commits on github
          </v-btn>
        </div>
      </v-col>
      <v-col class="mt-4" md="6" cols="12" offset-md="3">
        <libraries />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Libraries from "./Libraries.vue";
import CommitTimeline from "./CommitTimeline.vue";
import { useHead } from "@unhead/vue";
import { useDisplay } from "vuetify";

useHead({ title: "About" });

const { smAndDown } = useDisplay();
</script>
