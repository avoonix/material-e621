<template>
  <v-list
    v-if="type == 'sidebar' || type == 'dropdown'"
    subheader
    class="pa-0 mt-3"
  >
    <v-list-tile
      v-for="(option, index) in navigationOptions"
      :key="index"
      ripple
      :router="option.router"
      :to="option.to"
      :exact="option.exact"
      avatar
      @click.prevent="option.onClick ? option.onClick() : null"
      :disabled="option.disabled"
    >
      <v-list-tile-action>
        <v-badge v-if="option.badge" right :value="option.badgeCount">
          <span slot="badge">{{ option.badgeCount }}</span>
          <v-icon>{{ option.icon }}</v-icon>
        </v-badge>
        <v-icon v-else>{{ option.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ option.name }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
  <v-bottom-nav
    v-else-if="type == 'bottom'"
    :active.sync="bottomNav"
    class="sidenav-color"
    :style="
      `background-color: ${currentTheme.sidebar} !important; border-color: ${currentTheme.sidebar} !important;`
    "
    fixed
    shift
    app
    :value="navMode == 'bottom'"
  >
    <v-btn
      v-for="(option, index) in navigationOptions"
      :key="index"
      :loading="option.loading"
      :disabled="option.disabled"
    >
      <span>{{ option.name }}</span>
      <v-icon>{{ option.icon }}</v-icon>
    </v-btn>
  </v-bottom-nav>
  <v-toolbar-items v-else-if="type == 'toolbar' && navMode == 'toolbar'">
    <v-btn
      flat
      v-for="(option, index) in navigationOptions"
      :key="index"
      :color="option.active ? 'primary' : ''"
      :loading="option.loading"
      @click.prevent="option.onClick ? option.onClick() : null"
      :to="option.to"
      :disabled="option.disabled"
    >
      <v-badge v-if="option.badge" right :value="option.badgeCount">
        <span slot="badge">{{ option.badgeCount }}</span>
        <span>{{ option.name }}</span>
      </v-badge>
      <span v-else>{{ option.name }}</span>
    </v-btn>
  </v-toolbar-items>
</template>

<script>
import { GETTERS } from "../store/constants";

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    postCount: {
      type: Number,
      required: true,
    },
    blacklistCount: {
      type: Number,
      required: true,
    },
    blacklistOpen: {
      type: Boolean,
      required: true,
    },
    navMode: {
      type: String,
      required: true,
    },
  },
  computed: {
    currentTheme() {
      return this.$store.getters[GETTERS.CUSTOM_COLORS];
    },
    navigationOptions() {
      return [
        {
          icon: "mdi-home",
          name: "Home",
          router: true,
          exact: true,
          to: {
            path: "/e621",
            query: this.$store.state.routerModule.query,
          },
          active: this.$store.state.routerModule.path == "/e621",
        },
        {
          icon: "mdi-settings",
          name: "Settings",
          router: true,
          exact: false,
          to: {
            path: "/settings",
            query: this.$store.state.routerModule.query,
          },
          active: this.$store.state.routerModule.path.startsWith("/settings"),
        },
        {
          icon: "mdi-braille",
          name: "Post suggester",
          router: true,
          exact: true,
          to: {
            path: "/suggester",
            query: this.$store.state.routerModule.query,
          },
          active: this.$store.state.routerModule.path == "/suggester",
        },
        {
          icon: "mdi-block-helper",
          name: "Edit blacklist",
          router: false,
          exact: false,
          onClick: () => (this.blacklistOpenSynced = true),
          to: null,
          badge: true,
          badgeCount: this.blacklistCount,
          active: this.blacklistOpenSynced,
        },
        {
          icon: "mdi-folder-download",
          name: `Download all ${this.postCount} images on this page`,
          router: false,
          exact: false,
          onClick: () => this.$store.dispatch("downloadPage"),
          to: null,
          disabled: this.postCount == 0 || this.$store.state.zip.loading,
          loading: this.$store.state.zip.loading,
        },
      ];
    },
    bottomNav: {
      get() {
        const index = this.navigationOptions.find((v) => v.active);
        if (index >= 0) return index;
        return 0;
      },
      set(val) {
        const option = this.navigationOptions[val] || {};
        if (option.onClick) return option.onClick();
        if (option.to) return this.$router.push(option.to);
        console.log("No nav event defined");
      },
    },
    blacklistOpenSynced: {
      get() {
        return this.blacklistOpen;
      },
      set(val) {
        this.$emit("update:blacklistOpen", val);
      },
    },
  },
};
</script>
