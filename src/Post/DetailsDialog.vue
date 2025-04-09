<template>
  <v-dialog v-model="dialog" scrollable max-width="600px" scrim="primary">
    <v-card v-if="current" color="secondary">
      <v-card-title class="mt-0 pt-0 mx-0 px-0">
        <v-tabs v-model="tabs">
          <v-tab value="overview">Overview</v-tab>
          <v-tab value="tags">Tags</v-tab>
          <v-tab value="description">Description</v-tab>
          <v-tab value="share">Share</v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text>
        <v-tabs-window v-model="tabs">
          <v-tabs-window-item value="overview">
            <v-card text>
              <v-card-text>
                <post-info-list :post="current" />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="tags">
            <v-card text>
              <v-card-text>
                <suggestions :tags="tags" />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="description">
            <v-card text>
              <v-card-text>
                <div class="text-body-1">
                  <d-text :text="current.description || 'No description'" />
                </div>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="share">
            <v-card text>
              <v-card-text>
                <link-share
                  v-if="current.file.url"
                  :post-id="current.id"
                  :raw-file-url="current.file.url"
                />
                <div v-else>
                  Post can't be shared at this time.
                </div>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <post-buttons
          :buttons="buttons"
          :post="current"
          @open-post-details="dialog = false"
          @open-post-fullscreen="$emit('open-post-fullscreen', $event)"
          @set-post-favorite="$emit('set-post-favorite', $event)"
        />
        <v-btn color="primary" variant="text" @click.native="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Suggestions from "./Suggestions.vue";
import DText from "../Parser/DText.vue";
import PostInfoList from "./PostInfoList.vue";
import LinkShare from "./LinkShare.vue";
import PostButtons from "@/Post/PostButtons.vue";
import type { PropType} from "vue";
import { computed, defineComponent, ref } from "vue";
import type { EnhancedPost } from "@/worker/ApiService";
import { usePostsStore } from "@/services";
import type { ITag } from "@/Tag/ITag";

export default defineComponent({
  components: {
    Suggestions,
    DText,
    PostInfoList,
    LinkShare,
    PostButtons,
  },
  props: {
    current: {
      type: Object as PropType<EnhancedPost>,
      required: false,
    },
  },
  setup(props, context) {
    const posts = usePostsStore();
    const buttons = computed(() => posts.detailsButtons);
    const tabs = ref(1);
    const tags = computed(() => {
      const allTags: ITag[] = [];
      if (!props.current) {
        return allTags;
      }
      for (const [category, tags] of Object.entries(props.current.tags)) {
        allTags.unshift(
          ...tags.map((tag: string) => ({
            name: tag,
            post_count: 0,
            category,
          })),
        );
      }

      return allTags;
    });

    const dialog = computed<boolean>({
      get() {
        return !!props.current;
      },
      set(val) {
        if (!val) {
          context.emit("close");
        }
      },
    });

    return {
      buttons,
      tabs,
      tags,
      dialog,
    };
  },
});
</script>
