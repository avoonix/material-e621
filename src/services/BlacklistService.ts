import { state } from "./state";

class BlacklistService {
  public get mode() {
    return state.blacklist.mode;
  }
  public set mode(value) {
    state.blacklist.mode = value;
  }

  public get tags() {
    return state.blacklist.tags;
  }

  public addTag(tag: string) {
    this.removeTag(tag);
    state.blacklist.tags.push(this.stripTag(tag));
  }

  public removeTag(tag: string) {
    const idx = state.blacklist.tags.indexOf(this.stripTag(tag));
    if (idx >= 0) {
      state.blacklist.tags.splice(idx, 1);
    }
  }

  private stripTag(tag: string) {
    return tag
      .trim()
      .toLowerCase()
      .replaceAll(/^-/g, "");
  }
}

export const blacklistService = new BlacklistService();
