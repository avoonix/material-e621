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
    createWikiUrl({ tag }) {
      return `https://e621.net/wiki/show?title=${tag}`;
    },
    createStandalonePostUrl({ id }) {
      return `https://e621.net/post/show/${id}`;
    },
    createSubmitCommentUrl({ postId, username, key, body, proxy }) {
      return `${proxy}/comment/create.json?comment[post_id]=${postId}&comment[body]=${body}&login=${username}&password_hash=${key}`;
    },
    createPostUrl({ id }) {
      return `https://e621.net/posts.json?tags=id:${id}`;
    },
    createCommentsUrl({ id }) {
      return `https://e621.net/comments.json?post_id=${id}`; // TODO: not described in official api docs
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

const submitComment = ({ postId, username, key, body, proxy }) => {
  return axios
    .post(
      api.e621.createSubmitCommentUrl({
        postId,
        username,
        key,
        body,
        proxy,
      }),
    )
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
};

const loadComments = ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        api.e621.createCommentsUrl({
          id: id,
        }),
        {
          responseType: "json",
        },
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
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

const postIsBlacklisted = ({ post, blacklist }) => {
  const tags = Object.values(post.tags).reduce(
    (prev, cur) => [...prev, ...cur],
    [],
  );
  blacklist = (blacklist || "")
    .split(" ")
    .filter((str) => str.length > 0)
    .map((str) => (str[0] == "-" ? str.substring(1) : str));
  let tag, bTag;
  switch (post.rating) {
    case "s":
      tags.push("rating:s");
      tags.push("rating:safe");
      break;
    case "q":
      tags.push("rating:q");
      tags.push("rating:questionable");
      break;
    default:
      tags.push("rating:e");
      tags.push("rating:explicit");
      break;
  }
  for (tag of tags) {
    for (bTag of blacklist) {
      if (tag == bTag) {
        return true;
      }
    }
  }
  return false;
};

const createQuery = (blacklistMode, blacklistStr, tagsStr) => {
  const includeBlacklistInQuery =
    blacklistMode === "dynamic" || blacklistMode === "tags"; // other implementations hide/blur/blackout posts
  const tagsArr = [
    ...tagsStr.split(" ").filter((str) => str.length > 0),
    ...(includeBlacklistInQuery
      ? blacklistStr
          .split(" ")
          .filter((str) => str.length > 0)
          .map((str) => (str.startsWith("-") ? str : "-" + str))
      : []),
  ].map((str) =>
    str
      .replace(/\brating:e\b/g, "rating:explicit")
      .replace(/\brating:q\b/g, "rating:questionable")
      .replace(/\brating:s\b/g, "rating:safe"),
  );

  const implications = [
    {
      contains: ["-rating:explicit", "-rating:questionable"],
      replace: "rating:safe",
    },
    {
      contains: ["-rating:safe", "-rating:questionable"],
      replace: "rating:explicit",
    },
    {
      contains: ["-rating:safe", "-rating:explicit"],
      replace: "rating:questionable",
    },
    {
      contains: ["rating:explicit", "rating:questionable"],
      replace: "-rating:safe",
    },
    {
      contains: ["rating:safe", "rating:questionable"],
      replace: "-rating:explicit",
    },
    {
      contains: ["rating:safe", "rating:explicit"],
      replace: "-rating:questionable",
    },
  ];

  // e621 can't process duplicate metatags - they have to be converted (eg -rating:safe + -rating:questionable => rating:explicit)
  for (const implication of implications) {
    let matches = true;
    for (const str of implication.contains) {
      if (tagsArr.indexOf(str) === -1) {
        matches = false;
        break;
      }
    }
    if (matches) {
      tagsArr.push(implication.replace);
      for (const str of implication.contains) {
        const index = tagsArr.indexOf(str);
        tagsArr.splice(index, 1);
      }
    }
  }

  // reorder the tags based on importance (matters if the array contains more than 6 tags)
  const positiveTags = [],
    negativeTags = [];
  let sortedArr = []; // everything in here will be the first elements of the result array; it's fine to put tags in there that are also in positiveTags or negativeTags because of uniq
  for (const tag of tagsArr) {
    if (tag.indexOf("rating:") !== -1) {
      sortedArr.push(tag);
    } else if (tag.startsWith("-")) {
      negativeTags.push(tag);
    } else {
      positiveTags.push(tag);
    }
  }

  const result = uniq([
    ...sortedArr,
    ...positiveTags,
    ...negativeTags.sort((a, b) => {
      // also sort based on posts per tag(if available)
      // let countA = (allTags[a.replace(/^-/, "")] || {}).count || 0;
      // let countB = (allTags[b.replace(/^-/, "")] || {}).count || 0;
      let countA = 0;
      let countB = 0;
      // rank metatags a bit higher than tags without a count
      if (a.indexOf(":") !== -1) countA++;
      if (b.indexOf(":") !== -1) countB++;
      return countB - countA;
    }),
  ]);
  // console.log(result);
  return result.slice(0, 6).join(" "); // limit tags + blacklisted tags to 6
};

export {
  downloadPost,
  api,
  normalizePosts,
  favoritePost,
  loadComments,
  postIsBlacklisted,
  submitComment,
  createQuery,
};
