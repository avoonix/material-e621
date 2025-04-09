<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" cols="12" sm="10" offset-sm="1" lg="6" offset-lg="3">
        <settings-page-title section="info" title="Info" color="teal-darken-2" />
        <settings-page-item title="Version Info" select>
          You are running {{ appName }}, which was last changed with commit
          <a :href="`https://github.com/avoonix/material-e621/commit/${commit.hash}`" target="_blank">{{
            commit.hash.substring(0, 7) }}</a>
          on <b>{{ commitDate }}</b> (this was <b>{{ commitDateRelative }}</b>) from branch <b>{{ branch }}</b>.
          <v-btn color="accent" variant="text" @click="forceUpdate" block>
            Force Update
          </v-btn>
          <v-btn color="accent" variant="text" to="/about" block> View Commits </v-btn>
        </settings-page-item>
        <settings-page-item :title="`Storage`"
          description="Shows the storage used for cached files, settings and cached tags." select>
          <div class="text-left px-1">
            Persistence: permission {{ persistence ? "granted" : "not granted" }}
            <br />
            Used: {{ usageStr }}
          </div>
          <v-progress-linear color="accent" class="ma-1" indeterminante :model-value="usagePercentage" />
          <v-btn v-if="!persistence" variant="text" block color="accent" @click="requestPersistence">Request
            Persistence</v-btn>
        </settings-page-item>
        <settings-page-item title="Bookmarklet">
          <install />
        </settings-page-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SettingsPageTitle from "./SettingsPageTitle.vue";
import SettingsPageItem from "./SettingsPageItem.vue";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import Install from "@/Settings/Install.vue";
import { getGitInfo, getGitBranchInfo } from "@/misc/util/git";
import { getAppName } from "@/misc/util/utilities";
import { format, formatDistanceToNow } from "date-fns";
import { prettyBytes } from "@/misc/util/prettyBytes";
import { useHead } from "@unhead/vue";

useHead({ title: "Info", });

const storage = reactive({
  used: 0,
  total: 0,
});
const usageStr = computed(
  () => `${prettyBytes(storage.used)} / ${prettyBytes(storage.total)}`,
);
const usagePercentage = computed(
  () => (storage.used / (storage.total || 1)) * 100,
);
navigator.storage.estimate().then((estimate) => {
  storage.used = estimate.usage || 0;
  storage.total = estimate.quota || 0;
});
const commit = getGitInfo()[0];
const branch = getGitBranchInfo();
const commitDate = computed(() => format(commit.date, "PP p"));
const commitDateRelative = computed(() =>
  formatDistanceToNow(commit.date, { addSuffix: true }),
);
const forceUpdate = () => {
  navigator.serviceWorker
    .getRegistrations()
    .then((re) => re.map((r) => r.unregister()))
    .then((p) => Promise.all(p))
    .then(() => caches.keys())
    .then((keys) => keys.map((key) => caches.delete(key)))
    .then((p) => Promise.all(p))
    .then(() => location.reload());
};
const persistence = ref<boolean>();
onMounted(() => {
  navigator?.storage?.persisted?.().then(res => persistence.value = res);
})
const requestPersistence = async () => {
  const res = await navigator.storage.persist();
  persistence.value = res;
}

const appName = getAppName();
</script>
