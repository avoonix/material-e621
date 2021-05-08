import { state } from "./state";

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
}

export const appearanceService = new AppearanceService();
