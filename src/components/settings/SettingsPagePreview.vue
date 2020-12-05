<template>
  <v-flex xs12 sm8 offset-sm2 lg6 offset-lg3 class="my-2">
    <v-card>
      <div :class="color">
        <v-icon size="200">{{ icon }}</v-icon>
      </div>
      <v-card-title primary-title>
        <div class="title">{{ title }}</div>
      </v-card-title>
      <v-card-text class="grey--text text-xs-left">
        {{ text }}
        <br />
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          color="accent"
          :to="{
            path: '/settings/' + section,
            query: $store.state.routerModule.query,
          }"
          >Edit
          <v-icon right>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    section: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  methods: {},
  computed: {
    // backgroundStyle() {
    //   return {
    //     backgroundColor: "#" + stringToRgb(this.section)
    //   };
    // }
  },
};
</script>
