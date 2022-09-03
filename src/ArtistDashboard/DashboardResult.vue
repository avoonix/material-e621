<template>
  <v-container fill-height v-if="!result">
    <v-layout align-center justify-center>
      <progress-message :value="progress" />
    </v-layout>
  </v-container>
  <v-container fluid v-else>
    <h1 class="text-center text-h2 mt-2">{{ artist }}</h1>
    <v-card class="my-2" color="transparent" flat>
      <v-card-title>Uploads During the Past Year</v-card-title>
      <v-card-text>
        <UploadHeatmap :heatmap="result.heatmap.days" :max="result.heatmap.max" />
      </v-card-text>
    </v-card>
    <v-card class="my-2" color="transparent" flat>
      <v-card-title>Metrics</v-card-title>
      <v-card-text>
        <ArtistMetrics :metrics="result.metrics" />
      </v-card-text>
    </v-card>
    <v-card class="my-2" color="transparent" flat>
      <v-card-title>Top Tags</v-card-title>
      <v-card-text>
        <ArtistTags :tags="result.topTags" />
      </v-card-text>
    </v-card>
    <v-card class="my-2" color="transparent" flat>
      <v-card-title>Posts</v-card-title>
      <v-card-text>
        <PostsDataTable :posts="result.posts" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { useRoute } from "@/misc/util/router";
import ProgressMessage from "@/Suggester/ProgressMessage.vue";
import { IProgressEvent } from "@/worker/AnalyzeService";
import { IDashboardArgs, IDashboardResult } from "@/worker/DashboardService";
import { getDashboardService } from "@/worker/services";
import * as Comlink from "comlink";
import debounce from "lodash.debounce";
import { computed, defineComponent, ref, watch } from "vue";
import PostsDataTable from "./PostsDataTable.vue";
import ArtistMetrics from "./ArtistMetrics.vue";
import ArtistTags from "./ArtistTags.vue";
import UploadHeatmap from "./UploadHeatmap.vue";

export default defineComponent({
  metaInfo: {
    title: "Dashboard",
  },
  components: {
    ProgressMessage,
    PostsDataTable,
    ArtistMetrics,
    ArtistTags,
    UploadHeatmap
},
  setup(props, context) {
    const progress = ref<IProgressEvent>();

    const artist = computed<string>(() => {
      let name = "";
      const route = useRoute(); // weird recursive type
      if(route.params.name) name = route.params.name;
      return name;
    });

    const args = computed<IDashboardArgs>(() => {
      return {
        artist: artist.value,
      };
    });

    const result = ref<IDashboardResult>();

    const getResult = debounce(async () => {
      const service = await getDashboardService();
      result.value = await service.getDashboardResult(
        args.value,
        Comlink.proxy((progressEvent) => {
          progress.value = progressEvent;
        }),
      );
    }, 500);

    watch(args, () => {
      getResult();
    }, { immediate: true })

    return {
      progress,
      result,
      artist,
    };
  },
});
</script>
