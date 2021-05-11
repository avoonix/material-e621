export enum BlacklistMode {
  hide,
  blur,
  blackout,
}

export type ButtonType = "info" | "fullscreen" | "external";

export interface ISettingsServiceState {
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
    hideFullscreenUiOnZoom: boolean;
    sidebarSuggestionLimit: number;
    postListFetchLimit: number;
    tagFetchLimit: number;
    goFullscreen: boolean;
  };
  account: {
    username: string | null;
    apiKey: string | null;
  };
}

