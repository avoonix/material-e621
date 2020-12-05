<template>
  <v-menu
    v-if="queryHistory.length >= 2"
    bottom
    left
    max-height="300"
    lazy
    offset-y
    transition="slide-y-transition"
  >
    <v-btn slot="activator" dark icon>
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile
        avatar
        v-for="(item, i) in queryHistory"
        :key="i"
        @click="setSearch(item)"
      >
        <tag-list-display v-if="item" :tags="item" />
        <v-list-tile-title v-else>Empty query</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>
<script>
import TagListDisplay from "./TagListDisplay.vue";

export default {
  components: {
    TagListDisplay,
  },
  computed: {
    queryHistory() {
      return this.$store.state.queryHistory;
    },
  },
  methods: {
    setSearch(item) {
      this.setQueryParams(item);
      this.$emit("item-selected", true);
    },
    setQueryParams(tags) {
      this.$store.dispatch("resetNoResults");
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
          tags: tags,
        },
      });
    },
  },
};
</script>
