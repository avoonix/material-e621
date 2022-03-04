import Vue from "vue";
import { withFallback } from "./fallback";
import { state } from "./state";
import { ISettingsServiceState } from "./types";

class AppearanceService {
  public get primaryColor() {
    return state.appearance.primary;
  }
  public set primaryColor(value) {
    state.appearance.primary = value;
  }

  public get secondaryColor() {
    return state.appearance.secondary;
  }
  public set secondaryColor(value) {
    state.appearance.secondary = value;
  }

  public get accentColor() {
    return state.appearance.accent;
  }
  public set accentColor(value) {
    state.appearance.accent = value;
  }

  public get backgroundColor() {
    return state.appearance.background;
  }
  public set backgroundColor(value) {
    state.appearance.background = value;
  }

  public get toolbarColor() {
    return withFallback(state.appearance.toolbar, "#020c1c");
  }
  public set toolbarColor(value) {
    Vue.set(state.appearance, "toolbar", value);
  }

  public get sidebarColor() {
    return state.appearance.sidebar;
  }
  public set sidebarColor(value) {
    state.appearance.sidebar = value;
  }

  public get dark() {
    return state.appearance.dark;
  }
  public set dark(value) {
    state.appearance.dark = value;
  }

  public get fullscreenTransition() {
    return state.appearance.transition.fullscreen;
  }
  public set fullscreenTransition(value) {
    state.appearance.transition.fullscreen = value;
  }

  public get routeTransition() {
    return state.appearance.transition.route;
  }
  public set routeTransition(value) {
    state.appearance.transition.route = value;
  }

  public get ratingStripe() {
    return state.appearance.coloredRatingStripe;
  }
  public set ratingStripe(value) {
    state.appearance.coloredRatingStripe = value;
  }

  public get navigationType() {
    return state.appearance.navigationType;
  }
  public set navigationType(value) {
    state.appearance.navigationType = value;
  }

  public get logoStyle() {
    return state.appearance.logoStyle;
  }
  public set logoStyle(value) {
    state.appearance.logoStyle = value;
  }

  public get logoStyles(): ISettingsServiceState["appearance"]["logoStyle"][] {
    return ["face", "text"];
  }

  public get hideInstallPrompt() {
    return state.appearance.hideInstallPrompt;
  }
  public set hideInstallPrompt(value) {
    state.appearance.hideInstallPrompt = value;
  }

  applyTheme(theme: Theme) {
    this.primaryColor = theme.primary;
    this.secondaryColor = theme.secondary;
    this.accentColor = theme.accent;
    this.backgroundColor = theme.background;
    this.sidebarColor = theme.sidebar;
    this.toolbarColor = theme.toolbar;
    this.dark = theme.dark;
  }

  public get theme() {
    return {
      primary: this.primaryColor,
      secondary: this.secondaryColor,
      accent: this.accentColor,
      background: this.backgroundColor,
      sidebar: this.sidebarColor,
      toolbar: this.toolbarColor,
      dark: this.dark,
    };
  }
}

export type Theme = AppearanceService["theme"];
export type ThemeItem = Theme & { name: string };

export const appearanceService = new AppearanceService();
