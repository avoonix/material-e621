<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>
        <commit-timeline :dense="$vuetify.breakpoint.smAndDown" />
        <v-btn
          block
          class="mt-0"
          color="primary"
          href="https://github.com/avoonix/material-e621/commits/master"
        >
          view older commits on github
        </v-btn>
        <v-flex class="mt-4" md6 xs12 offset-md3>
          <libraries />
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Libraries from "./Libraries.vue";
import CommitTimeline from "./CommitTimeline.vue";

export default defineComponent({
  metaInfo: {
    title: "About",
  },
  components: {
    Libraries,
    CommitTimeline,
  },
  setup() {
    return {};
  },
});
</script>
