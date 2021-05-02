<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex text-xs-center xs12 md8 offset-md2>
        <v-form @submit="submit">
          <v-text-field
            v-model="username"
            append-icon="mdi-send"
            @click:append="submit"
            label="Username"
          />
          <slider-group v-model="sliders" />
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import router from "@/router";
import { computed, defineComponent, ref, reactive } from "@vue/composition-api";
import { RawLocation } from "vue-router";
import SliderGroup from "./SliderGroup.vue";

export default defineComponent({
  metaInfo: {
    title: "Post suggester",
  },
  components: { SliderGroup },
  setup(props, context) {
    const username = ref("");
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
    const submit = () => {
      router.push(query.value);
    };
    return {
      username,
      submit,
      sliders,
    };
  },
});
</script>
