<template>
  <span>
    <v-btn
      v-for="button in buttons"
      :key="button.value"
      @click="toggleBlacklisted(button)"
      outline
      :color="button.blacklisted ? 'red' : 'green'"
    >
      <v-icon left>{{
        button.blacklisted ? "mdi-block-helper" : "mdi-check-decagram"
      }}</v-icon>
      {{ button.display || button.value }}
    </v-btn>
  </span>
</template>
<script>
import blacklistSuggestions from "../config/blacklistSuggestions";
import { GETTERS } from "../store/constants";

export default {
  props: {
    suggestedBlacklist: {
      type: Array,
      default: () => blacklistSuggestions,
    },
  },
  computed: {
    blacklistArray: {
      get() {
        return this.$store.getters[GETTERS.GET_BLACKLIST_ARRAY];
      },
      set(val) {
        this.$router.push({
          query: {
            ...this.$store.state.routerModule.query,
            blacklist: val.join(" "),
          },
        });
      },
    },
    buttons() {
      return this.suggestedBlacklist.map(({ text, display }) => ({
        value: text,
        display,
        blacklisted: this.blacklistArray.indexOf(text) !== -1,
      }));
    },
  },
  methods: {
    toggleBlacklisted(button) {
      this.$store.dispatch("resetNoResults");
      if (button.blacklisted) {
        this.blacklistArray = this.blacklistArray.filter(
          (str) => str != button.value,
        );
      } else {
        this.blacklistArray = [...this.blacklistArray, button.value];
      }
    },
  },
};
</script>
