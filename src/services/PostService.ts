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

  public get hideFullscreenUiOnZoom() {
    return state.posts.hideFullscreenUiOnZoom;
  }
  public set hideFullscreenUiOnZoom(value) {
    state.posts.hideFullscreenUiOnZoom = value;
  }
}

export const postService = new PostService();
