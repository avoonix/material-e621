// import { normalizePosts } from "../store/api";
import * as plugins from "../utilities/vuePlugin";
import { debug } from "debug";

import { getApiService } from "../worker/services";

const allCategories = [
  "general",
  "artist",
  "copyright",
  "character",
  "species",
];

const maxFavoritesToFetchPerRequest = 320; // maximum: 320

const minSuggestionsToFetch = 50;
const minSuggestionsToFetchPerRequest = 320;

const wait = (t) => {
  // eslint-disable-next-line
  return new Promise((r) => setTimeout(r, t));
};

export const filterPostScore = (minScore) => (post) => {
  return post.custom_post_score >= minScore;
};

export const mapPostScore = (tags, weights, maxTagMatchesPerCategory) => (
  post,
) => {
  let score = 0; // score between 0 and 1
  score +=
    (tags.rating[post.rating] / maxTagMatchesPerCategory.rating) * 0.04 || 0; // rating counts up to 4% of total score
  for (const category of allCategories) {
    let matchedTags = 0;
    const userTags = tags[category]; // {text: String, count: Number}[]
    const postTags = post.tags[category]; // String[]
    for (let i = 0; i < postTags.length; i++) {
      for (let j = 0; j < userTags.length; j++) {
        if (postTags[i] == userTags[j].text) {
          // matchedTags changes between +.5 and +1.5
          matchedTags += 0.5;
          const tagScore =
            userTags[j].count / maxTagMatchesPerCategory[category];
          if (tagScore) {
            matchedTags += tagScore;
          }
        }
      }
    }
    const categoryScore = matchedTags / postTags.length;
    const categoryWeight = weights[category] / 100;
    if (categoryScore && categoryWeight) {
      score += categoryScore * categoryWeight;
    }
  }
  return { ...post, custom_post_score: Math.min(1, score) };
};

export const getMaxTagMatches = (tags) => {
  const retVal = {};
  for (const category of allCategories) {
    // those are sorted
    retVal[category] = (tags[category][0] || {}).count || 1;
  }
  for (const r of ["s", "q", "e"]) {
    retVal.rating = (retVal.rating || 0) + (tags.rating[r] || 0);
  }
  return retVal;
};

export const fetchSuggestions = async ({
  progress: onProgress,
  tags,
  alreadyFavoritedPosts,
  weights,
  minScore,
  beforeId, // initial before id
}) => {
  const sendProgress = () => {
    if (onProgress) {
      onProgress({
        current: matchingPosts.length,
        total: minSuggestionsToFetch,
      });
    }
  };
  let matchingPosts = [];
  let currentBeforeId = false;
  const maxTagMatchesPerCategory = getMaxTagMatches(tags);
  while (matchingPosts.length < minSuggestionsToFetch) {
    sendProgress();
    const fetchedPosts = await fetchMultiplePosts({
      tags: "",
      limit: minSuggestionsToFetch,
      limitPerRequest: minSuggestionsToFetchPerRequest,
      beforeId: currentBeforeId || beforeId,
    });

    const currentMatchingPosts = Object.values(fetchedPosts.posts)
      .filter((post) => alreadyFavoritedPosts.indexOf(post.id) === -1)
      .map(mapPostScore(tags, weights, maxTagMatchesPerCategory))
      .filter(filterPostScore(minScore));
    matchingPosts.push(...currentMatchingPosts);
    currentBeforeId = fetchedPosts.result[fetchedPosts.result.length - 1];
    sendProgress();
  }
  // return { posts: normalizePosts(matchingPosts), beforeId: currentBeforeId };
};

const log = debug("app:suggesters");

export const extractFavoriteTags = async ({ favoritesResult: favorites }) => {
  log("favorites result", favorites);
  const occurences = {
    artist: {},
    character: {},
    copyright: {},
    species: {},
    general: {},
    rating: {
      e: 0,
      q: 0,
      s: 0,
    },
  };
  for (const postId in favorites.posts) {
    if (favorites.posts.hasOwnProperty(postId)) {
      const post = favorites.posts[postId];
      for (const category of allCategories) {
        const tags = post.tags[category]; // array

        for (const tag of tags) {
          if (tag in occurences[category]) {
            occurences[category][tag].count++;
          } else {
            occurences[category][tag] = {
              color: plugins.getTagColor(category),
              count: 1,
              text: tag,
              type: category,
            };
          }
        }
      }
      occurences.rating[post.rating] =
        (occurences.rating[post.rating] || 0) + 1;
    }
  }
  const retVal = {};
  for (const category of allCategories) {
    retVal[category] = Object.values(occurences[category]).sort(
      (a, b) => b.count - a.count,
    );
  }
  retVal.rating = occurences.rating; //  // e, q, s => number
  // console.log(occurences.rating);
  log("extracted favorite tags", retVal);
  return retVal;
};

export const fetchMultiplePosts = async ({
  tags,
  limit,
  limitPerRequest,
  progress: onProgress,
  beforeId: initialBeforeId,
}) => {
  const fetchPart = (partBeforeId) =>
    getApiService().then((service) =>
      service
        .getPosts({
          limit: limitPerRequest,
          tags: tags.split(" "),
          postsBefore: partBeforeId,
        })
        .then((posts) => normalizePosts(posts)),
    );

  const fetchedPosts = { posts: {}, result: [] };
  const sendProgress = () => {
    if (onProgress) {
      onProgress({
        current: fetchedPosts.result.length,
        total: limit,
      });
    }
  };
  let lastFetch;
  do {
    sendProgress();
    const beforeId =
      lastFetch && lastFetch.result
        ? lastFetch.result[lastFetch.result.length - 1]
        : initialBeforeId || false;
    lastFetch = await fetchPart(beforeId);
    fetchedPosts.result.push(...lastFetch.result);
    fetchedPosts.posts = Object.assign(fetchedPosts.posts, lastFetch.posts);
    sendProgress();
    await wait(500);
  } while (
    lastFetch.result.length == limitPerRequest &&
    fetchedPosts.result.length < limit
  );
  return fetchedPosts;
};

export const fetchFavoritePosts = async ({
  username,
  minFavoriteCount,
  progress: onProgress,
}) => {
  return fetchMultiplePosts({
    tags: `fav:${username}`,
    limit: minFavoriteCount,
    limitPerRequest: maxFavoritesToFetchPerRequest,
    progress: onProgress,
  });
};
