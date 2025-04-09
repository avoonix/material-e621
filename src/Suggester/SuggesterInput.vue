<template>
  <v-container class="fill-height">
    <v-row align-center>
      <v-col class="text-center" cols="12" md="8" offset-md="2">
        <v-card>
          <v-card-text>
            <v-form @submit="submit">
              <v-text-field v-model="username" append-icon="mdi-send" @click:append="submit" label="Username" />
            </v-form>
            <slider-group v-model="sliders" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAccountStore } from "@/services";
import { computed, defineComponent, reactive, ref } from "vue";
import { useRouter, type RouteLocationRaw } from "vue-router";
import SliderGroup from "./SliderGroup.vue";
import { useHead } from "@unhead/vue";

useHead({ title: "Post Suggester", });

const account = useAccountStore();
const username = ref(account.username || "");
const router = useRouter();
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
const query = computed<RouteLocationRaw>(() => ({
  name: "SuggesterResult",
  query: {
    name: username.value,
    ...Object.fromEntries(
      Object.entries(sliders).map(([key, value]) => [key, `${value}`]),
    ),
  },
}));
const submit = async (event?: SubmitEvent | MouseEvent) => {
  event?.preventDefault?.();
  router.push(query.value);
};
</script>
