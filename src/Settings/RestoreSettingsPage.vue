<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
        <settings-page-title section="restore" title="Backup and Restore" color="blue-darken-1" />
        <settings-page-item title="Backup settings"
          description="Download your settings as JSON file. This file contains your API Keys (if you have added them) - so you shouldn't share it with anyone. "
          switch>
          <v-btn variant="text" color="accent" class="mb-3" @click="download">
            download
          </v-btn>
        </settings-page-item>

        <form>
          <settings-page-item title="Restore settings" switch>
            <!-- description="Upload your settings from a JSON file." -->
            <!-- <v-btn flat color="accent" class="mb-3">upload</v-btn> -->
            <input ref="fileInput" class="file-btn" name="file" type="file" @change="restore()" />
            <v-btn variant="text" color="accent" class="mb-3" @click="openFileInput">
              upload
            </v-btn>
            <v-btn variant="text" color="accent" class="mb-3" @click="reset">
              reset to default
            </v-btn>
          </settings-page-item>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { usePersistanceService, useSnackbarStore } from "@/services";
import { defineComponent, ref } from "vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import SettingsPageTitle from "./SettingsPageTitle.vue";
import { downloadjs } from "./download";
import { useHead } from "@unhead/vue";

useHead({
  title: "Backup and Restore",
});

const snackbar = useSnackbarStore();
const persistanceService = usePersistanceService();
const fileInput = ref<HTMLInputElement>();
const download = async () => {
  const file = await persistanceService.stateToFile();
  downloadjs(file, file.name, file.type);
};
const restore = async () => {
  const file = fileInput.value?.files?.[0];
  if (!file) return;
  await persistanceService.loadStateFromFile(file);
  snackbar.addMessage("successfully restored settings");
};
const reset = () => {
  persistanceService.resetStateToDefault();
  snackbar.addMessage("successfully reset settings");
};
const openFileInput = () => {
  fileInput.value?.click();
};
</script>

<style scoped>
.file-btn {
  opacity: 0;
  position: absolute;
  height: 0;
  width: 0;
}
</style>
