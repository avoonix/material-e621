<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" cols="12" md="8" offset-md="2">
        <v-form @submit="submit">
          <v-text-field v-model="username" append-icon="mdi-send" @click:append="submit" label="Username" />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAccountStore } from "@/services";
import { useHead } from "@unhead/vue";
import { computed, ref } from "vue";
import { useRouter, type RouteLocationRaw } from "vue-router";

useHead({ title: "Favorite Analyzer" });

const account = useAccountStore();
const username = ref(account.username || "");
const query = computed<RouteLocationRaw>(() => ({
  name: "FavoritesAnalyzerResult",
  query: { name: username.value },
}));
const router = useRouter()
const submit = async (event?: Event) => {
  event?.preventDefault?.();
  router.push(query.value);
};
</script>
