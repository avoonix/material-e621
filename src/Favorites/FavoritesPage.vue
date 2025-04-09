<template>
  <div>
    <v-container class="fill-height">
      <v-row align-center>
        <v-col cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
          <v-card v-for="(names, category) in tags" :key="category" class="my-2">
            <v-card-title>
              {{ category }}
            </v-card-title>
            <v-card-text>
              <v-list density="compact" color="transparent">
                <v-list-item v-for="(display, name) in names" :key="name">

                  <div>
                    <span v-if="String(name).startsWith('-')">Exclude </span>
                    <TagLabel :tag="{
                      name:
                        typeof display === 'string'
                          ? display
                          : String(name),
                      category: String(category),
                    }" />
                  </div>

                  <template #append>
                    <v-btn icon :to="{
                      name: 'Posts',
                      query: {
                        tags: String(name),
                      },
                    }">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn icon @click="removeFavorite(String(name), String(category))">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, watch } from "vue";
import TagLabel from "@/Tag/TagLabel.vue";
import { useFavoritesStore } from "@/services/FavoriteStore";
import { useRouter } from "vue-router";

const favorites = useFavoritesStore();
const tags = computed(() => favorites.tags);
const removeFavorite = (name: string, category: string) => {
  favorites.setFavorite(name, category, false);
};

const router = useRouter()

const hasFavorites = computed(() => favorites.hasFavorites);

watch(hasFavorites, async () => {
  if (!hasFavorites.value) {
    router.push({ name: "Posts" });
  }
});

</script>
