<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="500px">
    <v-card>
      <v-card-title>Your download is ready</v-card-title>
      <v-card-text>
        <div class="body-1 mb-3">
          Make sure your browser doesn't block downloads
        </div>
        <v-text-field
          label="File name"
          v-model="name"
          suffix=".zip"
          box
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" flat @click.native="dialog = false">Close</v-btn>
        <v-btn color="primary" flat @click.native="startDownload"
          >Download</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      name: "e621 download",
    };
  },
  methods: {
    startDownload() {
      const url = window.URL.createObjectURL(new Blob([window.zipBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", (this.name || "download") + ".zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  computed: {
    dialog: {
      get() {
        return this.$store.state.zip.ready;
      },
      set(val) {
        this.$store.state.zip.ready = val;
      },
    },
  },
};
</script>

<style scoped></style>
