<template>
  <v-dialog v-model="dialog" scrollable max-width="600px">
    <v-card v-if="current" color="secondary">
      <v-card-title class="mt-0 pt-0 mx-0 px-0">
        <v-tabs v-model="tabs">
          <v-tab ripple>Overview</v-tab>
          <v-tab ripple>Tags</v-tab>
          <v-tab ripple>Description</v-tab>
          <v-tab ripple>Share</v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-card text color="secondary">
              <v-card-text>
                <post-info-list :post="current" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card text color="secondary">
              <v-card-text>
                <suggestions class="secondary" :tags="tags" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card text color="secondary">
              <v-card-text>
                <div class="text-body-1">
                  <d-text :text="current.description || 'No description'" />
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card text color="secondary">
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
          </v-tab-item>
        </v-tabs-items>
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
        <v-btn color="primary" text @click.native="dialog = false">Close</v-btn>
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
import { computed, defineComponent, PropType, ref } from "vue";
import { postService } from "@/services";
import { Post } from "@/worker/api";
import { ITag } from "../Tag/TagLabel.vue";
import { EnhancedPost } from "@/worker/ApiService";

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
    const buttons = computed(() => postService.detailsButtons);
    const tabs = ref(1);
    const tags = computed(() => {
      const allTags: ITag[] = [];
      if (!props.current) {
        return allTags;
      }
      for (const [category, tags] of Object.entries(props.current.tags)) {
        allTags.push(
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
