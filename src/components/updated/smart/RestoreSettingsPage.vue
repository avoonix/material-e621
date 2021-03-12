<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 md8 offset-md2>
        <settings-page-title title="Backup and restore" color="darken-1 blue" />
        <settings-page-item title="Backup settings" switch>
          <!-- description="Download your settings as JSON file." -->
          <v-btn flat color="accent" class="mb-3" @click="download">
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
              @change="restore($event.target.files[0])"
            />
            <v-btn
              flat
              color="accent"
              class="mb-3"
              @click="() => $refs.fileInput.click()"
            >
              upload
            </v-btn>
            <v-btn flat color="accent" class="mb-3" @click="reset">
              reset to default
            </v-btn>
          </settings-page-item>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import SettingsPageTitle from "../dumb/SettingsPageTitle.vue";
import SettingsPageItem from "../dumb/SettingsPageItem.vue";
import { computed, defineComponent } from "@vue/composition-api";
import { persistanceService, snackbarService } from "@/services";
import downloadjs from "downloadjs";

export default defineComponent({
  metaInfo: {
    title: "Backup and restore settings",
  },
  components: {
    SettingsPageTitle,
    SettingsPageItem,
  },
  setup(props, context) {
    const download = async () => {
      const file = await persistanceService.stateToFile();
      downloadjs(file, file.name, file.type);
    };
    const restore = async (file: File) => {
      await persistanceService.loadStateFromFile(file);
      snackbarService.addMessage("successfully restored settings");
    };
    const reset = () => {
      persistanceService.resetStateToDefault();
      snackbarService.addMessage("successfully reset settings");
    };
    return {
      download,
      restore,
      reset,
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
