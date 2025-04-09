<template>
  <v-fab-transition mode="out-in">
    <v-btn
      :key="isFavorited ? 0 : 1"
      :color="isFavorited ? 'yellow' : ''"
      icon
      size="small"
      @click.stop="toggleFavorite"
    >
      <v-icon v-if="isFavorited"> mdi-star </v-icon>
      <v-icon v-else> mdi-star-outline </v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script lang="ts">
import { useFavoritesStore } from "@/services/FavoriteStore";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    displayText: {
      type: String,
      required: false,
    }
  },
  setup(props, context) {
    const favorites = useFavoritesStore();
    const isFavorited = computed(() =>
      favorites.isFavorited(props.name, props.category),
    );
    const toggleFavorite = () => {
      favorites.setFavorite(
        props.name,
        props.category,
        !isFavorited.value,
        props.displayText,
      );
    };
    return {
      isFavorited,
      toggleFavorite,
    };
  },
});
</script>
