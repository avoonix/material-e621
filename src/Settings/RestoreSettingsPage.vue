<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 sm10 offset-sm1 lg6 offset-lg3>
        <settings-page-title title="Backup and Restore" color="darken-1 blue" />
        <settings-page-item
          title="Backup settings"
          description="Download your settings as JSON file. This file contains your API Keys (if you have added them) - so you shouldn't share it with anyone. "
          switch
        >
          <v-btn text color="accent" class="mb-3" @click="download">
            download
          </v-btn>
        </settings-page-item>

        <form>
          <settings-page-item title="Restore settings" switch>
            <!-- description="Upload your settings from a JSON file." -->
            <!-- <v-btn flat color="accent" class="mb-3">upload</v-btn> -->
            <input
              ref="fileInput"
              class="file-btn"
              name="file"
              type="file"
              @change="restore()"
            />
            <v-btn text color="accent" class="mb-3" @click="openFileInput">
              upload
            </v-btn>
            <v-btn text color="accent" class="mb-3" @click="reset">
              reset to default
            </v-btn>
          </settings-page-item>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { usePersistanceService, useSnackbarStore } from "@/services";
import downloadjs from "downloadjs";
import { defineComponent, ref } from "vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import SettingsPageTitle from "./SettingsPageTitle.vue";

export default defineComponent({
  metaInfo: {
    title: "Backup and Restore",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
  },
  setup(props, context) {
    const snackbar = useSnackbarStore();
    const persistanceService = usePersistanceService();
    const fileInput = ref<HTMLInputElement>();
    const download = async () => {
      const file = await persistanceService.stateToFile();
      downloadjs(file, file.name, file.type);
    };
    const restore = async () => {
      const file = fileInput.value?.files?.[0];
      if(!file) return;
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
    return {
      download,
      restore,
      reset,
      openFileInput,
      fileInput
    };
  },
});
</script>

<style scoped>
.file-btn {
  opacity: 0;
  position: absolute;
  height: 0;
  width: 0;
}
</style>
