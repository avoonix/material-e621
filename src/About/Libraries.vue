<template>
  <v-card color="secondary">
    <v-card-title>Third party libraries</v-card-title>
    <v-card-text>
      <div class="text-body-1 mb-2">
        Special thanks to these libraries and their maintainers.
      </div>
      <ul v-if="libraries">
        <li v-for="library in libraries" :key="library">
          {{ library }} -
          <external-link :href="`https://www.npm.im/${library}`">
            npm
          </external-link>
          &nbsp;-
          <external-link :href="`https://yarn.pm/${library}`">
            yarn
          </external-link>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import ExternalLink from "@/App/ExternalLink.vue";
import { defineComponent } from "@vue/composition-api";
import packageJson from "../../package.json";

export default defineComponent({
  components: { ExternalLink },
  props: {},
  setup(props, context) {
    const libraries = [
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {}),
    ];
    return {
      libraries,
    };
  },
});
</script>
