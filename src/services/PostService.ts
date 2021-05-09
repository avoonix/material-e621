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

  public get postListFetchLimit() {
    return state.posts.postListFetchLimit;
  }
  public set postListFetchLimit(value) {
    state.posts.postListFetchLimit = value;
  }
  public get sidebarSuggestionLimit() {
    return state.posts.sidebarSuggestionLimit;
  }
  public set sidebarSuggestionLimit(value) {
    state.posts.sidebarSuggestionLimit = value;
  }
  public get tagFetchLimit() {
    return state.posts.tagFetchLimit;
  }
  public set tagFetchLimit(value) {
    state.posts.tagFetchLimit = value;
  }
}

export const postService = new PostService();
