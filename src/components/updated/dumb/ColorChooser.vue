<template>
  <v-layout>
    <v-select
      :background-color="currentColor"
      :items="colors"
      label="Choose"
      box
      solo
      hide-details
      v-model="currentColor"
    >
      <template
        slot="selection"
        slot-scope="{ item, selected, disabled, index }"
      >
        {{ item.name }}
      </template>
      <template slot="item" slot-scope="{ item, title }">
        <v-list-tile-avatar>
          <v-avatar size="36" :color="item.value">
            <v-icon size="20">mdi-palette</v-icon>
          </v-avatar>
        </v-list-tile-avatar>
        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
      </template>
    </v-select>
  </v-layout>
</template>

<script lang="ts">
import vuetifyColors from "vuetify/es5/util/colors";
import { computed, defineComponent } from "@vue/composition-api";

const colorOrder = [
  "darken4",
  "darken3",
  "darken2",
  "darken1",
  "base",
  "lighten1",
  "lighten2",
  "lighten3",
  "lighten4",
  "accent1",
  "accent2",
  "accent3",
];

const colors = Object.entries(vuetifyColors).reduce<
  { name: string; value: any }[]
>(
  (prev, [color, cur]) => [
    ...prev,
    ...Object.entries(cur as any)
      .filter(([k, _]) => colorOrder.indexOf(k) !== -1)
      .sort(([k1], [k2]) => colorOrder.indexOf(k2) - colorOrder.indexOf(k1))
      .map(([k, c]) => ({ name: `${color} ${k}`, value: c })),
  ],
  [],
);

export default defineComponent({
  props: {
    color: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const currentColor = computed<string>({
      get() {
        return props.color;
      },
      set(val) {
        context.emit("update:color", val);
      },
    });
    return {
      currentColor,
      colors,
    };
  },
});
</script>
