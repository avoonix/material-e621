<template>
  <v-card
    v-ripple
    @click="$emit('apply-theme')"
    class="ma-2"
    style="cursor: pointer"
  >
    <v-layout class="pa-0">
      <v-flex xs3>
        <v-card class="fill-height no-border-radius" :color="theme.sidebar">
          <div style="padding: 2px" />
          <theme-text
            style="margin: auto"
            width="30%"
            :ratio="1"
            color="#10559c"
          />
          <div style="padding: 2px" />
          <theme-text
            width="50%"
            :ratio="0.2"
            :color="color"
            style="margin-top: 4px; margin-left: 4px"
            v-for="(color, i) in sidebar"
            :key="i"
          />
          <div style="padding: 2px" />
          <theme-text
            width="25%"
            :ratio="0.3"
            :class="color"
            style="margin-top: 4px; margin-left: 4px; border-radius: 30px"
            v-for="(color, i) in tags"
            :key="i"
          />
        </v-card>
      </v-flex>
      <v-flex xs9>
        <v-card :color="theme.background" class="no-border-radius">
          <v-toolbar
            dense
            :color="theme.toolbar"
            :class="theme.dark ? 'white--text' : 'black--text'"
          >
            {{ theme.name }}
          </v-toolbar>
          <v-layout align-center row wrap>
            <v-flex xs12 class="text-xs-center">
              <theme-text
                width="15%"
                :ratio="0.25"
                :color="theme.accent"
                style="display: inline-block"
              />
            </v-flex>
            <v-flex xs6 offset-xs3 v-for="i in 1" :key="i">
              <v-card class="mb-2" :color="theme.secondary">
                <img class="img" :src="imageSrc" />
                <theme-text
                  width="50%"
                  :ratio="0.15"
                  :color="theme.dark ? 'white' : 'black'"
                  style="margin-left: 2px"
                />
                <div style="display: flex; justify-content: flex-end">
                  <theme-text
                    style="margin: 1px; border-radius: 50%"
                    width="5%"
                    :ratio="1"
                    :color="theme.dark ? 'white' : 'black'"
                    v-for="i in 3"
                    :key="i"
                  />
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { getTagColorFromCategory } from "@/misc/util/utilities";
import { Theme } from "@/services";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import imageSrc from "./image.jpg";
import ThemeText from "./ThemeText.vue";

export default defineComponent({
  components: {
    ThemeText,
  },
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, context) {
    const sidebar = computed(() => [
      props.theme.dark ? "white" : "black",
      props.theme.primary,
      props.theme.dark ? "white" : "black",
      props.theme.dark ? "white" : "black",
    ]);
    const tags = [
      "general",
      "artist",
      "general",
      "copyright",
      "character",
      "general",
      "artist",
      "general",
    ].map((t) => getTagColorFromCategory(t));
    return {
      imageSrc,
      sidebar,
      tags,
    };
  },
});
</script>

<style scoped>
.no-border-radius {
  border-radius: 0;
}
.img {
  width: 100%;
}
</style>
