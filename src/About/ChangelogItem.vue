<template>
  <v-hover>
    <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 16 : 1}`">
      <v-card-title class="headline">{{ item.headline }}</v-card-title>
      <v-card-text v-if="item.text || item.changes">
        {{ item.text }}
        <ul v-if="item.changes" :class="{ 'pt-3': item.text }">
          <template v-for="change in item.changes">
            <li :key="change.text">
              <router-link
                v-if="change.path"
                :class="`${change.color}--text`"
                :to="{ path: change.path, query: $route.query }"
                >{{ change.text }}</router-link
              >
              <span v-else :class="`${change.color}--text`">{{
                change.text
              }}</span>
              <div v-if="change.description">{{ change.description }}</div>
              <ul v-if="change.list" style="white-space: pre-line">
                <li v-for="li in change.list" :key="li">{{ li }}</li>
              </ul>
            </li>
          </template>
        </ul>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
});
</script>
