import { GETTERS, ACTIONS } from "../store/constants";
import axios from "axios";
import { api } from "../store/api";
import { snackbarService } from "@/services";

export const openOnE621 = {
  methods: {
    openOnE621(id) {
      const win = window.open(
        api.e621.createStandalonePostUrl({
          id,
        }),
        "_blank",
      );
      win.focus();
    },
  },
};

export const downloadPost = {
  data() {
    return {
      downloadPostLoading: false,
    };
  },
  methods: {
    downloadPost_({ filename, loadEnd, url }) {
      axios({
        method: "GET",
        url: url,
        responseType: "arraybuffer",
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          loadEnd();
        })
        .catch((error) => {
          loadEnd(error);
        });
    },
    downloadPost(post) {
      this.downloadPostLoading = true;
      const filename = this.$store.getters[GETTERS.IS_DESCRIPTIVE_FILENAME]
        ? post.id + " " + post.custom_all_tags + "." + post.file_ext
        : post.file_url.split("/").slice(-1)[0];
      this.downloadPost_({
        filename: filename,
        loadEnd: (error) => {
          if (error) {
            snackbarService.addMessage(error.message || error);
          }
          this.downloadPostLoading = false;
        },
        url: "https://cors-anywhere.herokuapp.com/" + post.file_url,
      });
    },
  },
};

export const togglePostFavorite = {
  data() {
    return { favoritePostLoading: false, favoritePostLoadingTimeout: 0 };
  },
  watch: {
    post(val, prev) {
      if (val.custom_favorited_by_user != prev.custom_favorited_by_user) {
        this.favoritePostLoading = false;
      }
    },
  },
  methods: {
    togglePostFavorite(post) {
      this.favoritePostLoading = true;
      clearTimeout(this.favoritePostLoadingTimeout);
      this.favoritePostLoadingTimeout = setTimeout(() => {
        this.favoritePostLoading = false;
      }, 30000);
      const action = post.custom_favorited_by_user ? "destroy" : "create";
      this.$store.dispatch("favoritePost", {
        action: action,
        postId: post.id,
      });
    },
  },
};
