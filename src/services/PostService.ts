import { state } from "./state";

class PostService {
  public get buttons() {
    return [...state.posts.buttons];
  }
  public set buttons(value) {
    state.posts.buttons = [...value];
  }

  public get fullscreenButtons() {
    return [...state.posts.fullscreenButtons];
  }
  public set fullscreenButtons(value) {
    state.posts.fullscreenButtons = [...value];
  }

  public get detailsButtons() {
    return [...state.posts.detailsButtons];
  }
  public set detailsButtons(value) {
    state.posts.detailsButtons = [...value];
  }
}

export const postService = new PostService();
