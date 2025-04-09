<template>
  <v-card>
    <v-card-title>Third party libraries</v-card-title>
    <v-card-text>
      <div class="text-body-1 mb-2">
        Special thanks to these libraries and their maintainers.
      </div>
      <v-list v-if="libraries">
        <v-list-item v-for="library in libraries" :key="library">
          {{ library }}
          <template #append>
            <external-link :href="`https://www.npm.im/${library}`">
              npm
            </external-link>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import ExternalLink from "@/App/ExternalLink.vue";
import { defineComponent } from "vue";
import packageJson from "../../package.json";

const libraries = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {}),
];
</script>
