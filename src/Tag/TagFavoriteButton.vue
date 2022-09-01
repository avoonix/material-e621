<template>
  <v-fab-transition mode="out-in">
    <v-btn
      :key="isFavorited ? 0 : 1"
      :color="isFavorited ? 'yellow' : ''"
      icon
      small
      @click.stop="toggleFavorite"
    >
      <v-icon v-if="isFavorited"> mdi-star </v-icon>
      <v-icon v-else> mdi-star-outline </v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { favoriteService } from "@/services/FavoriteService";

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
    const isFavorited = computed(() =>
      favoriteService.isFavorited(props.name, props.category),
    );
    const toggleFavorite = () => {
      favoriteService.setFavorite(
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
