<template>
  <v-layout>
    <v-menu offset-y :close-on-content-click="false">
      <v-btn slot="activator" :color="currentColor" dark>Picker</v-btn>
      <chrome disable-alpha v-model="currentColor" />
    </v-menu>
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
        >{{ item.name }}</template
      >
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

<script>
import vuetifyColors from "vuetify/es5/util/colors";
import { GETTERS, ACTIONS } from "../../store/constants";
import colorOrder from "../../config/colorChooserOrder";
import { Chrome } from "vue-color";

const colors = Object.entries(vuetifyColors).reduce(
  (prev, [color, cur]) => [
    ...prev,
    ...Object.entries(cur)
      .filter(([k, _]) => colorOrder.indexOf(k) !== -1)
      .sort(([k1], [k2]) => colorOrder.indexOf(k2) - colorOrder.indexOf(k1))
      .map(([k, c]) => ({ name: `${color} (${k})`, value: c })),
  ],
  [],
);

export default {
  components: {
    Chrome,
  },
  props: {
    colorKey: {
      type: String,
      default: "primary",
    },
  },
  computed: {
    currentColor: {
      get() {
        return this.$store.getters[GETTERS.CUSTOM_COLORS][this.colorKey];
      },
      set(val) {
        this.$store.dispatch(ACTIONS.SET_CUSTOM_COLORS, {
          key: this.colorKey,
          color: val.hex || val,
        });
      },
    },
    colors() {
      return colors;
    },
  },
};
</script>
