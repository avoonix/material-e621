import { state } from "./state";

class SnackbarService {
  addMessage(message: string) {
    state.snackbar = message;
  }
  clearMessage() {
    state.snackbar = null;
  }
  get message() {
    return state.snackbar;
  }
}

export const snackbarService = new SnackbarService();
