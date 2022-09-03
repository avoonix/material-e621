<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-center xs12 md8 offset-md2>
        <v-form @submit="submit">
          <v-text-field v-model="username" append-icon="mdi-send" @click:append="submit" label="Username" />
        </v-form>
        <slider-group v-model="sliders" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { useAccountStore } from "@/services";
import { computed, defineComponent, reactive, ref } from "vue";
import { RawLocation } from "vue-router";
import SliderGroup from "./SliderGroup.vue";

export default defineComponent({
  metaInfo: {
    title: "Post Suggester",
  },
  components: { SliderGroup },
  setup(props, context) {
    const account = useAccountStore();
    const username = ref(account.username || "");
    const sliders = reactive({
      general: 5,
      artist: 30,
      copyright: 25,
      character: 15,
      species: 25,
      meta: 0,
      lore: 0,
      invalid: 0,
    });
    const query = computed<RawLocation>(() => ({
      name: "SuggesterResult",
      query: {
        name: username.value,
        ...Object.fromEntries(
          Object.entries(sliders).map(([key, value]) => [key, `${value}`]),
        ),
      },
    }));
    const submit = async (event?: SubmitEvent) => {
      event?.preventDefault?.();
      const { appRouter } = await import("@/misc/util/router");
      appRouter.push(query.value);
    };
    return {
      username,
      submit,
      sliders,
    };
  },
});
</script>
