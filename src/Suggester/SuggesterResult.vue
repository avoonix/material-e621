<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center ref="container">
        <div v-if="result">
          <!-- {{ result }} -->
          <base-tags :counts="result.counts" />
          <!-- TODO: post list -->
        </div>
        <div v-else>
          <logo loader />
          <span v-if="progress">{{ progress.message }}</span>
          <v-progress-linear
            v-if="progress"
            :value="progress.progress * 100"
            :indeterminate="progress.indeterminate"
          />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watchEffect,
} from "@vue/composition-api";
import router from "@/router";
import { FavoriteTagsResult, IProgressEvent } from "@/worker/AnalyzeService";
import { getAnalyzeService } from "@/worker/services";
import Logo from "../components/updated/dumb/Logo.vue";
import * as Comlink from "comlink";
import BaseTags from "./BaseTags.vue";

export default defineComponent({
  metaInfo: {
    title: "Suggestions",
  },
  components: {
    Logo,
    BaseTags,
  },
  setup(props, context) {
    const progress = ref<IProgressEvent>();

    const username = computed<string>(() =>
      router.currentRoute.query?.name?.toString(),
    );

    const keys = [
      "general",
      "artist",
      "copyright",
      "character",
      "species",
      "meta",
      "lore",
      "invalid",
    ];

    // TODO: use weights
    const weights = computed<any>(() => {
      const entries: any[] = Object.entries((router as any).currentRoute.query);
      const newEntries = entries
        .filter(([key]) => keys.includes(key))
        .map(([key, value]) => [key, Number(value) || 0]);
      return Object.fromEntries(newEntries) as any;
    });

    const result = ref<FavoriteTagsResult | null>(null);

    const analyze = async (username: string) => {
      const service = await getAnalyzeService();
      result.value = await service.getFavoriteTags(
        username,
        Comlink.proxy((progressEvent) => {
          progress.value = progressEvent;
        }),
      );
    };

    watchEffect(() => {
      analyze(username.value);
    });

    return {
      result,
      progress,
    };
  },
});
</script>
