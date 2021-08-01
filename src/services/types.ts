export enum BlacklistMode {
  hide,
  blur,
  blackout,
}

export type ButtonType = "info" | "fullscreen" | "external" | "favorite";

export enum FullscreenZoomUiMode {
  alwaysHide,
  neverHide,
  hideWhileZoomed,
}

export enum DataSaverType {
  auto,
  highest,
  medium,
  lowest,
}

export interface ISettingsServiceState {
  configVersion: undefined | 1;
  blacklist: {
    mode: BlacklistMode;
    tags: string[];
  };
  appearance: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    sidebar: string;
    toolbar: string;
    dark: boolean;
    transition: {
      route: string;
      fullscreen: string;
    };
    coloredRatingStripe: boolean;
    navigationType: "sidebar" | "toolbar" | "floating";
    logoStyle: "face" | "text";
    hideInstallPrompt: boolean;
  };
  history: {
    entries: string[][];
    maxLength: number;
  };
  snackbar: string | null;
  posts: {
    buttons: ButtonType[];
    fullscreenButtons: ButtonType[];
    detailsButtons: ButtonType[];
    fullscreenZoomUiMode: FullscreenZoomUiMode;
    sidebarSuggestionLimit: number;
    postListFetchLimit: number;
    tagFetchLimit: number;
    goFullscreen: boolean;
    dataSaver: DataSaverType;
  };
  // postList: {
  //   postLayout:
  //     | "blog"
  //     | "feed_xl"
  //     | "feed_md"
  //     | "feed_sm"
  //     | "grid_xl"
  //     | "grid_md"
  //     | "grid_sm";
  //   paginated: boolean;
  // };
  // post: {
  //   fullscreenButtonPosition:
  //     | "top_left"
  //     | "top_right"
  //     | "bottom_left"
  //     | "bottom_right";
  // };
  // download: {
  //   filenameTemplate: string;
  //   concurrency: number;
  // };
  account: {
    //   loggedIn: boolean;
    username: string | null;
    apiKey: string | null;
  };
}
