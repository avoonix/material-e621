<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 md8 offset-md2>
        <v-form @submit="submit">
          <v-text-field v-model="username" append-icon="mdi-send" @click:append="submit" label="Username" />
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import router from "@/router";
import { useAccountStore } from "@/services";
import { computed, defineComponent, ref } from "vue";
import { RawLocation } from "vue-router";

export default defineComponent({
  metaInfo: {
    title: "Favorite Analyzer",
  },
  components: {},
  setup(props, context) {
    const account = useAccountStore();
    const username = ref(account.username || "");
    const query = computed<RawLocation>(() => ({
      name: "FavoritesAnalyzerResult",
      query: { name: username.value },
    }));
    const submit = async (event?: SubmitEvent) => {
      event?.preventDefault?.();
      const { appRouter } = await import("@/misc/util/router");
      appRouter.push(query.value);
    };
    return {
      username,
      submit,
    };
  },
});
</script>
