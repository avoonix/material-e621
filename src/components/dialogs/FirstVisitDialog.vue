<template>
  <v-dialog v-model="dialog" scrollable max-width="500px" persistent>
    <v-card>
      <v-card-title>Welcome to {{ $appName }}!</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <d-text-display :text="rawText" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn flat @click.native="dialog = false">Agree and dismiss</v-btn>
        <v-btn
          color="primary"
          flat
          @click.native="dialog = false"
          :to="{
            path: '/settings/setup/1',
            query: $store.state.routerModule.query,
          }"
          >Agree and introduction</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GETTERS } from "../../store/constants";
import tos from "../../config/tos.dtext";
import DTextDisplay from "../DTextDisplay.vue";

export default {
  components: {
    DTextDisplay,
  },
  data() {
    return {
      rawText: tos,
      timerFinished: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.timerFinished = true;
    }, 500);
  },
  computed: {
    disabled() {
      return false;
    },
    dialog: {
      get() {
        return (
          this.timerFinished && this.$store.getters[GETTERS.SHOW_AGREEMENT]
        );
      },
      set(val) {
        this.$router.push({
          query: {
            ...this.$store.state.routerModule.query,
            agree: !val,
          },
        });
      },
    },
  },
};
</script>

<style scoped></style>
