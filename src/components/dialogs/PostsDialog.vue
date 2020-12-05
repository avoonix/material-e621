<template>
  <v-dialog v-model="dialog" scrollable>
    <v-card>
      <v-card-title>
        <v-progress-linear
          v-if="notYetLoadedPosts.length"
          indeterminate
          class="mt-0"
        ></v-progress-linear
        >Posts
      </v-card-title>
      <v-card-text>
        <post-list :visible-posts="visiblePosts" is-dialog />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" flat @click.native="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GETTERS, ACTIONS } from "../../store/constants";
import PostList from "../PostList.vue";

export default {
  components: {
    PostList,
  },
  data() {
    return {};
  },
  watch: {
    notYetLoadedPosts(val) {
      if (val && val.length) {
        // TODO: load posts
        // will only load one post at a time
        // setTimeout(() => {
        //   this.$store.dispatch("loadPost", { id: val[0] });
        // }, 500);
      }
    },
  },
  methods: {},
  computed: {
    dialog: {
      get() {
        return (
          this.visiblePosts.length > 0 || this.notYetLoadedPosts.length > 0
        );
      },
      set(val) {
        if (!val)
          this.$store.dispatch(ACTIONS.SET_VISIBLE_POSTS_DIALOG, {
            posts: [],
          });
      },
    },
    visiblePosts() {
      return this.$store.getters[GETTERS.GET_VISIBLE_POSTS_DIALOG];
    },
    notYetLoadedPosts() {
      return this.$store.getters[GETTERS.GET_NOT_YET_LOADED_POSTS_DIALOG];
    },
  },
};
</script>

<style scoped lang="stylus">
.hidden {
  visibility: hidden;
}

.fullscreen {
  z-index: 1000;
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;

  .flex {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100vh;
    width: 100%;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 60px;
    }

    .middle {
      flex-grow: 1;

      .overflow {
        overflow: hidden;
        height: 100%;
        width: 100%;

        img {
          max-height: 100%;
          max-width: 100%;
          height: 100%;
          width: 100%;
          object-fit: contain;
        }
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 60px;
    }
  }

  .top-right {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1005;

    button {
      float: right;
    }
  }

  .bottom-right {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1006;

    button {
      float: right;
    }
  }
}
</style>
