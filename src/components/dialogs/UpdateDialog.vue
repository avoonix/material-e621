<template>
  <v-dialog v-model="open" max-width="500px">
    <v-card>
      <v-card-title>Update available</v-card-title>
      <v-card-text>
        <div class="body-1 mb-3">
          A new version of {{ $appName }} is available and has been downloaded.
          Click update now to install the new version and reload the app.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" flat @click.native="updateServiceWorker">
          Install now
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GETTERS } from "../../store/constants";
import register from "../../utilities/registerServiceWorker";
export default {
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    register({
      updated: () => {
        this.open = true;
      },
    });
  },
  methods: {
    updateServiceWorker() {
      this.open = false;
      window.navigator.serviceWorker
        .getRegistrations()
        .then((re) => re.map((r) => Promise.all([r.update(), r.unregister()])))
        .then((p) => Promise.all(p))
        .then(() => caches.keys())
        .then((keys) => keys.map((key) => caches.delete(key)))
        .then((p) => Promise.all(p))
        .then(() => window.location.reload());
    },
  },
};
</script>

<style scoped></style>
