import { state } from "./state";

class AccountService {
  public get username() {
    return state.account.username;
  }
  public set username(value) {
    state.account.username = value;
  }

  public get apiKey() {
    return state.account.apiKey;
  }
  public set apiKey(value) {
    state.account.apiKey = value;
  }
}


export const accountService = new AccountService();
