import axios from "axios";
import uniq from "lodash.uniq";

// I wanted to be able to use other image boards but cors issues prevented this
const api = {
  createFavoriteUrl({ postId, action, username, key, proxy }) {
    // action -> create, destroy
    // username, key -> authentication
    return `${proxy}/favorite/${action}.json?id=${postId}&login=${username}&password_hash=${key}`;
  },
  e621: {
    createStandalonePostUrl({ id }) {
      return `https://e621.net/post/show/${id}`;
    },
    createPostUrl({ id }) {
      return `https://e621.net/posts.json?tags=id:${id}`;
    },
    transformTagList(data) {
      return data;
    },
    transformPoolList(data) {
      return data;
    },
  },
};

const normalizePosts = (posts) => {
  let normalized = { posts: {}, result: [] };
  for (const post of posts || []) {
    normalized.posts[post.id] = Object.seal(post);
    normalized.result.push(post.id);
  }
  return normalized;
};

const favoritePost = ({ postId, action, username, key, callback, proxy }) => {
  axios
    .post(api.createFavoriteUrl({ postId, action, username, key, proxy }))
    .then((response) => {
      return callback({ data: response.data });
    })
    .catch((error) => {
      if (error.response.status == 403) {
        // not authenticated
        return callback({ data: error.response.data, notAuthenticated: true });
      }
      if (error.response.status == 423) {
        // already exists
        return callback({ data: error.response.data, alreadyExists: true });
      }
      callback({
        data: error.response.data,
        otherError: true,
        message: error.message,
      });
    });
};

const downloadPost = ({ url, progress }) => {
  const onDownloadProgress = (event) => {
    const percentCompleted = Math.floor((event.loaded * 100) / event.total);
    progress(percentCompleted);
  };
  axios.defaults.onDownloadProgress = onDownloadProgress;
  return axios({
    method: "GET",
    url: url,
    responseType: "arraybuffer",
  }).then((response) => {
    return new Blob([response.data]);
  });
};

export { downloadPost, api, normalizePosts, favoritePost };
