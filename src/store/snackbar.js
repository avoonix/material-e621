import { MUTATIONS, GETTERS, ACTIONS } from "./constants";

const snackbarModule = {
  state: {
    currentMessage: false,
  },
  mutations: {
    [MUTATIONS.ADD_MESSAGE](state, message) {
      state.currentMessage = { text: message, id: Math.random() };
    },
    [MUTATIONS.REMOVE_FIRST_MESSAGE](state) {
      state.currentMessage = false;
    },
  },
  getters: {
    [GETTERS.GET_FIRST_MESSAGE](state) {
      return state.currentMessage;
    },
  },
  actions: {
    [ACTIONS.ADD_MESSAGE]({ commit }, message) {
      commit(MUTATIONS.ADD_MESSAGE, message);
    },
    [ACTIONS.REMOVE_FIRST_MESSAGE]({ commit }) {
      commit(MUTATIONS.REMOVE_FIRST_MESSAGE);
    },
  },
};

export default snackbarModule;
