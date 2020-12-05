<template>
  <v-alert
    v-model="alert"
    dismissible
    type="error"
    icon="mdi-wifi-off"
    transition="slide-y-transition"
    outline
    >No internet connection</v-alert
  >
</template>
<script>
export default {
  mounted() {
    setTimeout(() => {
      this.alert = !window.navigator.onLine;

      window.removeEventListener("offline", this.onOffline);
      window.removeEventListener("online", this.onOnline);

      window.addEventListener("offline", this.onOffline);
      window.addEventListener("online", this.onOnline);
    }, 1000);
  },
  data() {
    return {
      alert: false,
    };
  },
  methods: {
    onOnline() {
      this.alert = false;
    },
    onOffline() {
      this.alert = true;
    },
  },
};
</script>
