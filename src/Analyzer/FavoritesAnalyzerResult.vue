<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center v-resize="onResize" ref="container">
        <div v-if="result">
          <div v-for="cloud in result.wordPositions" :key="cloud.category">
            <h3>
              {{ cloud.category }}
            </h3>
            <wordcloud
              :height="args.height"
              :width="args.width"
              :wordPositions="cloud.result"
            />
          </div>
        </div>
        <div v-else>
          <logo type="loader" />
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
  watch,
  watchEffect,
} from "@vue/composition-api";
import Wordcloud from "./Wordcloud.vue";
import { IAnalyzeTagsArgs, IProgressEvent } from "@/worker/AnalyzeService";
import { getAnalyzeService } from "@/worker/services";
import debounce from "lodash.debounce";
import { cloneDeep } from "lodash";
import Logo from "../App/Logo.vue";
import * as Comlink from "comlink";
import { useRoute } from "@/misc/util/router";

export default defineComponent({
  metaInfo: {
    title: "Favorite Analyzer",
  },
  components: {
    Wordcloud,
    Logo,
  },
  setup(props, context) {
    const route = useRoute();
    const container = ref();
    const progress = ref<IProgressEvent>();

    const width = ref(700);

    const args = computed<IAnalyzeTagsArgs>(() => {
      const username = route.query?.name?.toString();
      return {
        width: width.value,
        height: window.innerHeight * 0.66,
        tags: [`fav:${username}`],
        postLimit: 1000,
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

    const onResize = () => {
      width.value = container.value?.getBoundingClientRect?.().width;
      console.log("resize", width);
    };

    watch(container, onResize);

    return {
      args,
      result,
      onResize,
      container,
      width,
      progress,
    };
  },
});
</script>
