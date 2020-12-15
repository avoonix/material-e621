export enum BlacklistMode {
  hide,
  blur,
  blackout,
}

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
  };
}

