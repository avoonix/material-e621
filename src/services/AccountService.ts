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

  public get auth() {
    return state.account.apiKey && state.account.username
      ? {
          login: state.account.username,
          api_key: state.account.apiKey,
        }
      : undefined;
  }

  // TODO: favorites?
}

export const accountService = new AccountService();
