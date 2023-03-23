<template>
  <v-container fill-height v-if="!result">
    <v-layout align-center justify-center>
      <progress-message :value="progress" />
    </v-layout>
  </v-container>
  <v-container fluid v-else>
    <h1 class="text-center text-h2 mt-2">{{ artist }}</h1>
    <div class="d-flex justify-center mt-2">
      <v-btn :href="artistUrl" target="_blank" color="primary">
        View Profile <v-icon right>mdi-open-in-new</v-icon>
      </v-btn>
    </div>
    <v-row>
      <v-col cols="12">
        <v-card  color="transparent" flat>
          <v-card-title>Uploads During the Past Year</v-card-title>
          <v-card-text>
            <UploadHeatmap :heatmap="result.heatmap.days" :max="result.heatmap.max" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card  color="transparent" flat>
          <v-card-title>Uploads</v-card-title>
          <v-card-text>
            <ArtistMetrics :metrics="result.uploadMetrics" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card  color="transparent" flat>
          <v-card-title>Community</v-card-title>
          <v-card-text>
            <ArtistMetrics :metrics="result.communityMetrics" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card  color="transparent" flat>
          <v-card-title>Top Tags (Posts)</v-card-title>
          <v-card-text>
            <ArtistTags :tags="result.topTags.count" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card  color="transparent" flat>
          <v-card-title>Top Tags (Favorites per Post)</v-card-title>
          <v-card-text>
            <ArtistTags :tags="result.topTags.fav" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card  color="transparent" flat>
          <v-card-title>Top Tags (Upvote Rate)</v-card-title>
          <v-card-text>
            <ArtistTags :tags="result.topTags.up" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card  color="transparent" flat>
          <v-card-title>Top Tags (Downvote Rate)</v-card-title>
          <v-card-text>
            <ArtistTags :tags="result.topTags.down" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card  color="transparent" flat>
          <v-card-title>Posts</v-card-title>
          <v-card-text>
            <PostsDataTable :posts="result.posts" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
import { useUrlStore } from "@/services";

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
    const urlStore = useUrlStore();
    const progress = ref<IProgressEvent>();

    const artist = computed<string>(() => {
      let name = "";
      const route = useRoute(); // weird recursive type
      if (route.params.name) name = route.params.name;
      return name;
    });

    const args = computed<IDashboardArgs>(() => {
      return {
        artist: artist.value,
        baseUrl: urlStore.e621Url
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

    const url = useUrlStore();

    const artistUrl = computed(() => `${url.e621Url}artists/${encodeURIComponent(artist.value)}`)

    return {
      progress,
      result,
      artist,
      artistUrl,
    };
  },
});
</script>
