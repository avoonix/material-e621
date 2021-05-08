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
  };
  account: {
    username: string | null;
    apiKey: string | null;
  };
}

