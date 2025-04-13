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

export type Action =
  | "fullscreen_add_favorite"
  | "fullscreen_remove_favorite"
  | "fullscreen_toggle_favorite"
  | "fullscreen_next_post"
  | "fullscreen_previous_post"
  | "fullscreen_exit"
  | "go_to_posts"
  | "go_to_settings"
  | "focus_search";

export interface Shortcut {
  sequence: string;
  action: Action;
}

export interface SavedSearchEntry {
  name: string;
  tags: string[];
}

// export interface FavoritedSearch {
//   tags: string[];
//   firstPost?: number;
// }

export interface ISettingsServiceState {
  configVersion: undefined | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  shortcuts: Shortcut[];
  blacklist: {
    mode: BlacklistMode;
    tags: string[][];
    hideServerSideBlacklisted: boolean;
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
    hideGithubInfo: boolean;
    hideMigrationInfo: boolean;
  };
  history: {
    entries: string[][];
    maxLength: number;
  };
  searches: {
    entries: SavedSearchEntry[];
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
    lazyLoadImages: boolean;
    autoLoadNext: boolean;
  };
  favorites: {
    // searches: FavoritedSearch[];
    tags: {
      [category: string]: { [tag: string]: true | string };
    };
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
    username: string | null;
    apiKey: string | null;
  };
  misc: {
    urls: {
      proxy: string;
      e621: string;
    };
  };
}
