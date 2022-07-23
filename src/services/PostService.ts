import { state } from "./state";
import { ButtonType, DataSaverType, FullscreenZoomUiMode } from "./types";
import { withFallback } from "./fallback";
import Vue from "vue";

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

  public get allButtonTypes() {
    return ["info", "fullscreen", "external", "favorite"] as ButtonType[];
  }

  public get fullscreenZoomUiMode() {
    return withFallback(
      state.posts.fullscreenZoomUiMode,
      FullscreenZoomUiMode.hideWhileZoomed,
    );
  }
  public set fullscreenZoomUiMode(value) {
    Vue.set(state.posts, "fullscreenZoomUiMode", value);
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

  public get goFullscreen() {
    return state.posts.goFullscreen;
  }
  public set goFullscreen(value) {
    state.posts.goFullscreen = value;
  }

  public get dataSaver() {
    return withFallback(state.posts.dataSaver, DataSaverType.auto);
  }
  public set dataSaver(value) {
    Vue.set(state.posts, "dataSaver", value);
  }

  public get lazyLoad() {
    return state.posts.lazyLoadImages;
  }
  public set lazyLoad(value) {
    state.posts.lazyLoadImages = value;
  }
}

export const postService = new PostService();
