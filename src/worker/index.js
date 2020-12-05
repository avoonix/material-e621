import Worker from "worker-loader!./Worker.js";
import { GETTERS } from "../store/constants";

const worker = new Worker();

const runTask = (() => {
  const taskCallbacks = {};
  const highestTaskIDs = {}; // a new task should always replace an old one with the same name
  let taskID = 0;
  worker.addEventListener("message", function(event) {
    if (taskCallbacks[event.data.taskID]) {
      taskCallbacks[event.data.taskID].resolve(event.data.result);
      delete taskCallbacks[event.data.taskID];
    }
  });
  return (taskName, data) => {
    const currentTaskID = ++taskID;
    if (taskCallbacks[highestTaskIDs[taskName]]) {
      taskCallbacks[highestTaskIDs[taskName]].reject(
        new Error("replaced by newer task"),
      );
      delete taskCallbacks[highestTaskIDs[taskName]];
    }
    highestTaskIDs[taskName] = currentTaskID;
    return new Promise((resolve, reject) => {
      taskCallbacks[currentTaskID] = { resolve, reject };
      worker.postMessage({
        taskID: currentTaskID,
        taskName: taskName,
        data: data,
      });
    });
  };
})();

const runGetPostWorker = (store) => {
  store.watch(
    (state) => ({
      allPosts: state.allPosts,
      favoritedPosts: state.favoritedPosts,
      blacklistQuery: store.getters[GETTERS.GET_BLACKLIST_STRING],
      blacklistMode: store.getters[GETTERS.BLACKLIST_MODE],
    }), // getter
    async (newValue) => {
      try {
        const result = await runTask(GETTERS.GET_POST, newValue);
        store.state.WORKER_GET_POST = result;
      } catch (err) {
        // console.log(err.message); // Error: replaced by newer task
      }
    },
    {
      // deep: true,
      immediate: true,
    },
  );
};

export const runWorker = (store) => {
  runGetPostWorker(store);
};
