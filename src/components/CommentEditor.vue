<template>
  <v-card class="elevation-4 pa-3" v-if="loggedIn">
    <div>
      <d-text-display :text="text" />
    </div>
    <v-menu v-model="menu" :close-on-content-click="false" top>
      <v-btn slot="activator">Emojis</v-btn>
      <v-card>
        <v-text-field v-model="search" box class="pa-3" />
        <v-card-text style="height: 300px; overflow: scroll;width: 500px;">
          <span
            @click="
              insert(emoji);
              menu = false;
            "
            class="headline"
            v-for="(emoji, index) in emojis"
            :key="index"
            >{{ emoji }}</span
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="menu = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <!-- <picker title="Pick your emoji" :exclude="['recent']" :infinite-scroll="false" set="twitter" sheet-size="32" :style="{  }" /> -->
    <v-textarea
      box
      ref="textField"
      :disabled="loading"
      rows="6"
      counter="0"
      label="Write a comment"
      v-model="text"
      :hint="'Posting as ' + $store.state.settings.username"
    ></v-textarea>
    <div class="text-xs-right">
      <v-btn :loading="loading" @click="postComment" :disabled="text.length < 1"
        >Post comment
        <v-icon right>mdi-send</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>
<script>
import { GETTERS, ACTIONS } from "../store/constants";
import { submitComment } from "../store/api";
import { h } from "vue";
import DTextDisplay from "./DTextDisplay.vue";

let emojis = [],
  emojiKeywords = [],
  emojisLoaded = false;

export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  components: {
    DTextDisplay,
  },
  data() {
    return {
      text: "",
      loading: false,
      emojis: [],
      menu: false,
      search: "",
    };
  },
  mounted() {},
  methods: {
    updateSearch() {
      const newEmojis = [];

      for (let i = 0; i < emojiKeywords.length; i++) {
        if (emojiKeywords[i].indexOf(this.search) !== -1) {
          newEmojis.push(emojis[i]);
        }
      }

      this.$nextTick(() => {
        this.emojis = newEmojis;
      });
    },
    insert(emoji) {
      const selectionStart = this.$refs.textField.$el.querySelector("textarea")
        .selectionStart;
      this.text =
        this.text.slice(0, selectionStart) +
        emoji +
        this.text.slice(selectionStart);
      this.$refs.textField.$el.querySelector(
        "textarea",
      ).selectionStart = selectionStart;
      this.$refs.textField.$el.querySelector(
        "textarea",
      ).selectionEnd = selectionStart;
    },
    postComment() {
      this.loading = true;
      submitComment({
        postId: this.postId,
        username: this.$store.state.settings.username,
        key: this.$store.state.settings.apiKey,
        proxy: this.$store.state.settings.proxy,
        body: encodeURIComponent(this.text),
      })
        .then((data) => {
          this.loading = false;
          this.text = "";
          this.$emit("update-comments");
          console.log(data);
        })
        .catch((error) => {
          this.$store.dispatch(
            ACTIONS.ADD_MESSAGE,
            (error.response &&
              error.response.data &&
              error.response.data.reason) ||
              error.message ||
              error,
          );
          this.loading = false;
        });
    },
  },
  watch: {
    menu(val) {
      if (val && !emojisLoaded) {
        Promise.all([
          import(/* webpackChunkName: "emoji-editor" */ "emojis-list").then(
            (e) => (emojis = e.default),
          ),
          import(/* webpackChunkName: "emoji-editor" */ "emojis-keywords").then(
            (e) => (emojiKeywords = e.default),
          ),
        ]).then(() => this.updateSearch());
      }
    },
    search: {
      immediate: true,
      handler: "updateSearch",
    },
  },
  computed: {
    loggedIn() {
      return this.$store.getters[GETTERS.IS_LOGGED_IN];
    },
  },
};
</script>
