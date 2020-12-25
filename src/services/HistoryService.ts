import { readonly } from "@vue/composition-api";
import { state } from "./state";

class HistoryService {
  public addEntry(tags: string[]) {
    state.history.entries.unshift([...tags]);
    if (state.history.entries.length > this.maxLength) {
      state.history.entries.splice(
        this.maxLength,
        state.history.entries.length,
      );
    }
  }
  public deleteEntry(index: number) {
    state.history.entries.splice(index, 1);
  }
  public get entries() {
    return readonly(state.history.entries);
  }

  public get maxLength() {
    return state.history.maxLength;
  }
  public set maxLength(value) {
    state.history.maxLength = value;
  }
}

export const historyService = new HistoryService();
