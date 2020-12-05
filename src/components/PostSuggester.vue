<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center row fill-height>
      <v-flex>
        <v-flex
          md6
          xs12
          offset-md3
          v-if="!isWorking && !hasSuggestedTags"
          class="pa-2"
        >
          <v-text-field label="Your username" v-model="username" />
          <v-slider
            color="primary"
            class=""
            v-model="minFavoritePages"
            thumb-label
            :min="1"
            :max="10"
            label="Favorite pages to fetch"
          ></v-slider>
          <div class="grey--text mb-3">
            Increase the number of favorite pages to fetch to get better results
            (the page might be unresponsive while suggesting)
          </div>
          <v-btn
            @click="fetchFavorites"
            large
            color="primary"
            block
            :disabled="!username"
            >Get suggestions {{ username ? "for " + username : "" }}</v-btn
          >
        </v-flex>
        <v-flex
          v-if="hasSuggestedTags"
          :md6="!showPosts"
          xs12
          :offset-md3="!showPosts"
          class="pa-2"
        >
          <v-card>
            <v-card-title
              >Your suggestions are based on these tags</v-card-title
            >
            <v-card-text>
              <v-flex v-for="(tags, index) in suggestedTags" :key="index">
                <template v-if="tags && tags.length">
                  <tag-list-display
                    :tags="tags.slice(0, showPosts ? 5 : 10)"
                    show-numbers
                  />
                  <span
                    class="grey--text"
                    style="white-space: nowrap"
                    v-if="tags.length > (showPosts ? 5 : 10)"
                  >
                    (+
                    {{ tags.length - (showPosts ? 5 : 10) }} more)
                  </span>
                </template>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
        <template
          v-for="(section, index) in [
            'progress',
            'dialog',
            'posts',
            'progress',
            'dialog',
          ]"
        >
          <v-flex
            :key="index"
            v-if="
              isWorking && section == 'progress' && (showPosts || index == 0)
            "
            md6
            xs12
            offset-md3
            class="pa-2"
          >
            <v-card>
              <v-card-text>
                {{ progressText }}: {{ currentProgress }} /
                {{ totalProgress || 1 }} ({{ progressPercentage }})
                <v-progress-linear
                  :indeterminate="currentProgress == 0"
                  :value="(currentProgress / (totalProgress || 1)) * 100"
                />
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex
            :key="index"
            v-if="
              hasSuggestedTags &&
                !isWorking &&
                section == 'dialog' &&
                (showPosts || index == 1)
            "
            :md6="!showPosts"
            xs12
            :offset-md3="!showPosts"
            class="pa-2"
          >
            <v-card>
              <v-card-title>Adjust weights</v-card-title>
              <v-card-text>
                <v-layout wrap="">
                  <v-flex :md6="showPosts" xs12>
                    <v-slider
                      color="accent"
                      class="mx-4"
                      v-model="sliders.general"
                      @change="onSliderUpdate('general')"
                      thumb-label
                      :min="0"
                      :max="100"
                      label="General"
                    ></v-slider>
                  </v-flex>
                  <v-flex :md6="showPosts" xs12>
                    <v-slider
                      color="accent"
                      class="mx-4"
                      v-model="sliders.artist"
                      @change="onSliderUpdate('artist')"
                      thumb-label
                      :min="0"
                      :max="100"
                      label="Artist"
                    ></v-slider>
                  </v-flex>
                  <v-flex :md6="showPosts" xs12>
                    <v-slider
                      color="accent"
                      class="mx-4"
                      v-model="sliders.copyright"
                      @change="onSliderUpdate('copyright')"
                      thumb-label
                      :min="0"
                      :max="100"
                      label="Copyright"
                    ></v-slider>
                  </v-flex>
                  <v-flex :md6="showPosts" xs12>
                    <v-slider
                      color="accent"
                      class="mx-4"
                      v-model="sliders.character"
                      @change="onSliderUpdate('character')"
                      thumb-label
                      :min="0"
                      :max="100"
                      label="Character"
                    ></v-slider>
                  </v-flex>
                  <v-flex :md6="showPosts" xs12>
                    <v-slider
                      color="accent"
                      class="mx-4"
                      v-model="sliders.species"
                      @change="onSliderUpdate('species')"
                      thumb-label
                      :min="0"
                      :max="100"
                      label="Species"
                    ></v-slider>
                  </v-flex>
                  <v-flex :md6="showPosts" xs12>
                    <v-slider
                      color="primary"
                      class="mx-4"
                      v-model="minScore"
                      thumb-label
                      :min="20"
                      :max="75"
                      label="Minimum score"
                    ></v-slider>
                  </v-flex>
                </v-layout>
                <v-btn @click="fetchSuggestions" large block color="primary">
                  <span v-if="showPosts">Get more suggestions</span>
                  <span v-else>Start suggesting</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
          <posts
            :key="index"
            v-if="showPosts && section == 'posts'"
            is-controlled
            :controlled-loading="isWorking"
            @click="fetchSuggestions"
          />
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { GETTERS } from "../store/constants";
import {
  fetchFavoritePosts,
  extractFavoriteTags,
  fetchSuggestions,
} from "../utilities/suggesters";
import TagListDisplay from "./TagListDisplay";
import Posts from "./Posts.vue";

export default {
  metaInfo: {
    title: "Suggestions",
  },
  components: {
    TagListDisplay,
    Posts,
  },
  data() {
    return {
      isWorking: false,
      minFavoritePages: 4,
      //   isWorking: true,
      currentProgress: 0,
      totalProgress: 0,
      progressText: "",
      usernameInput: "",
      suggestedTags: {},
      alreadyFavoritedPosts: [],
      sliders: {
        general: 5,
        artist: 30,
        copyright: 25,
        character: 15,
        species: 25,
      },
      showPosts: false,
      beforeId: false,
      minScore: 65,
    };
  },
  watch: {},
  methods: {
    onSliderUpdate(key) {
      this.$nextTick(() => {
        const calculateOtherTotal = () => {
          let sum = 0;
          for (const otherKey of Object.keys(this.sliders)) {
            if (otherKey !== key) {
              sum += this.sliders[otherKey];
            }
          }
          return sum;
        };
        let otherValues = calculateOtherTotal();
        const valuesToSplit = 100 - this.sliders[key];
        for (const otherKey of Object.keys(this.sliders)) {
          if (otherKey !== key) {
            let previousPercentage = 0;
            if (otherValues) {
              previousPercentage = this.sliders[otherKey] / otherValues;
            } else {
              previousPercentage = 0.25;
            }
            this.sliders[otherKey] = Math.floor(
              previousPercentage * valuesToSplit,
            );
          }
        }
        otherValues = calculateOtherTotal();
        while (otherValues + this.sliders[key] != 100) {
          for (const otherKey of Object.keys(this.sliders)) {
            otherValues = calculateOtherTotal();
            if (otherKey !== key) {
              const difference = otherValues + this.sliders[key] - 100;
              if (difference < 0) {
                this.sliders[otherKey]++;
              } else if (difference > 0) {
                this.sliders[otherKey]--;
              } else {
                break;
              }
            }
          }
        }
      });
    },
    async fetchFavorites() {
      const favorites = await fetchFavoritePosts({
        minFavoriteCount: this.minFavoriteCount,
        username: this.username,
        progress: ({ current, total }) => {
          this.isWorking = true;
          this.currentProgress = current;
          this.totalProgress = total;
          this.progressText = "Fetching favorites";
        },
      });
      this.alreadyFavoritedPosts = favorites.result;
      this.suggestedTags = await extractFavoriteTags({
        favoritesResult: favorites,
      });
      this.isWorking = false;
    },
    async fetchSuggestions() {
      const { posts, beforeId } = await fetchSuggestions({
        tags: this.suggestedTags,
        weights: this.sliders,
        beforeId: this.beforeId,
        minScore: this.minScore / 100,
        alreadyFavoritedPosts: this.alreadyFavoritedPosts,
        progress: ({ current, total }) => {
          this.isWorking = true;
          this.currentProgress = current;
          this.totalProgress = total;
          this.progressText = "Fetching new posts";
        },
      });
      this.$store.commit("addPosts", {
        posts: posts,
        shouldContain: 0,
        page: 1,
      });
      this.isWorking = false;
      this.showPosts = true;
      this.beforeId = beforeId;
    },
  },
  computed: {
    minFavoriteCount() {
      return this.minFavoritePages * 320;
    },
    progressPercentage() {
      return (
        Math.min(
          100,
          (this.currentProgress / (this.totalProgress || 1)) * 100,
        ).toFixed(2) + "%"
      );
    },
    username: {
      get() {
        if (this.usernameInput) return this.usernameInput;
        return this.$store.state.settings.username;
      },
      set(val) {
        this.usernameInput = val;
      },
    },
    hasSuggestedTags() {
      return (
        this.suggestedTags &&
        this.suggestedTags.general &&
        this.suggestedTags.general.length
      );
    },
  },
};
</script>
