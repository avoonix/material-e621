<template>
  <div>
    <v-container fill-height>
      <v-layout align-center>
        <v-flex xs12 sm10 offset-sm1 lg6 offset-lg3>
          <v-card
            color="secondary"
            v-for="(names, category) in tags"
            :key="category"
            class="my-2"
          >
            <v-card-title>
              {{ category }}
            </v-card-title>
            <v-card-text>
              <v-list dense color="transparent">
                <v-list-item v-for="(display, name) in names" :key="name">
                  <v-list-item-content>
                    <div>
                      <span v-if="String(name).startsWith('-')">Exclude </span>
                      <TagLabel
                        :tag="{
                          name:
                            typeof display === 'string'
                              ? display
                              : String(name),
                          category: String(category),
                        }"
                      />
                    </div>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      :to="{
                        name: 'Posts',
                        query: {
                          tags: String(name),
                        },
                      }"
                    >
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn
                      icon
                      @click="removeFavorite(String(name), String(category))"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { favoriteService } from "@/services/FavoriteService";
import { computed, defineComponent, watch } from "@vue/composition-api";
import TagLabel from "@/Tag/TagLabel.vue";

export default defineComponent({
  setup(props, context) {
    const tags = computed(() => favoriteService.tags);
    const removeFavorite = (name: string, category: string) => {
      favoriteService.setFavorite(name, category, false);
    };

    const hasFavorites = computed(() => favoriteService.hasFavorites);

    watch(hasFavorites, async () => {
      if (!hasFavorites.value) {
        const { appRouter } = await import("@/misc/util/router");
        appRouter.push({ name: "Posts" });
      }
    });

    return {
      tags,
      removeFavorite,
    };
  },
  components: { TagLabel },
});
</script>
