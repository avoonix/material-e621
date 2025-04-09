<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col ref="container">
        <div v-if="result">
          <div v-for="cloud in result.wordPositions" :key="cloud.category">
            <h3 class="mt-8 mb-2">
              {{ cloud.category }}
            </h3>
            <v-virtual-scroll :items="cloud.result" height="320" item-height="48">
              <template v-slot:default="{ item }">
                <v-list-item>
                  <v-list-item-title>
                    <TagLabel :tag="{ name: item.text, category: cloud.category, }" />
                  </v-list-item-title>
                  <template v-slot:append>
                    <!-- <v-btn icon="mdi-pencil" size="x-small" variant="tonal"></v-btn> -->
                     {{ item.size }}
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </div>
        </div>
        <progress-message :value="progress" v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  watchEffect,
} from "vue";
import type { IAnalyzeTagsArgs, IProgressEvent } from "@/worker/AnalyzeService";
import { getAnalyzeService } from "@/worker/services";
import { cloneDeep, debounce } from "lodash";
import * as Comlink from "comlink";
import { useRoute } from "vue-router";
import ProgressMessage from "@/Suggester/ProgressMessage.vue";
import { useUrlStore } from "@/services";
import { useHead } from "@unhead/vue";
import TagLabel from "@/Tag/TagLabel.vue";

useHead({ title: "Favorite Analyzer" });

const route = useRoute();
const progress = ref<IProgressEvent>();
const urlStore = useUrlStore();

const args = computed<IAnalyzeTagsArgs>(() => {
  const username = route.query?.name?.toString();
  return {
    height: window.innerHeight * 0.66,
    tags: [`fav:${username}`],
    postLimit: 1000,
    baseUrl: urlStore.e621Url
    // TODO: useBlacklist: bool
  };
});

const result = ref();

const analyze = debounce(async (a) => {
  const service = await getAnalyzeService();
  result.value = await service.analyzeTags(
    a,
    Comlink.proxy((progressEvent) => {
      progress.value = progressEvent;
    }),
  );
}, 500);

watchEffect(() => {
  const a = cloneDeep(args.value);
  analyze(a);
});
</script>
