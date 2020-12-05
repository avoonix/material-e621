<template>
  <div>
    <v-menu bottom offset-y left attach close-delay="0" :nudge-width="200">
      <v-btn slot="activator" icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-list>
        <v-subheader v-if="loggedIn"
          >Logged in as {{ $store.state.settings.username }}</v-subheader
        >
        <!-- <v-list-tile v-if="loggedIn" @click="viewFavorites">
          <v-list-tile-title>View favorites</v-list-tile-title>
        </v-list-tile> -->
        <v-list-tile v-if="loggedIn" @click="detailsOpen = true">
          <v-list-tile-title>Advanced</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="loggedIn" @click="logOut">
          <v-list-tile-title>Log out</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-else @click="doAutoLogIn">
          <v-list-tile-title>Log in</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-dialog v-model="detailsOpen" scrollable max-width="500px">
      <v-card>
        <v-card-title>Advanced</v-card-title>
        <v-card-text v-if="detailsOpen">
          <v-btn block :loading="favoritesLoading" @click="fetchFavorites">
            Update all favorites ({{ $store.state.favoritedPosts.length }}
            loaded)
            <span slot="loader">
              <v-progress-circular indeterminate />
              {{ $store.state.favoritedPosts.length }} loaded
            </span>
          </v-btn>
          <small
            >Expect lag. The maximum number of favorites updated is 6400 for
            performance reasons. This may change in the future. Loading will
            continue when you close this dialog.</small
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="" flat @click.native="detailsOpen = false">Close</v-btn>
          <!-- <v-btn color="primary" flat @click.native="logIn">Save</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="open" scrollable max-width="500px">
      <form ref="loginForm">
        <v-card>
          <v-card-text v-if="open">
            <v-text-field
              box
              label="e621 User Name"
              type="text"
              v-model="usernameInput"
              :rules="[rules.required]"
              autocomplete="username"
            ></v-text-field>
            <v-text-field
              box
              :append-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
              :rules="[rules.required]"
              :type="show2 ? 'text' : 'password'"
              label="e621 API Key"
              v-model="keyInput"
              hint="Do not type in your password"
              @click:append="show2 = !show2"
              autocomplete="password"
            ></v-text-field>
            <v-text-field
              autocomplete="name"
              box
              label="Proxy"
              type="text"
              hint="Caution! The proxy owner may be able to see this"
              v-model="proxyInput"
              :rules="[rules.required]"
            ></v-text-field>
            <div class="body-1 mb-1">
              In order to add likes to your account, you need to be logged in.
              <div class="red--text">
                I currently can't verify these credentials. To test if
                everything worked, try liking a post and see if it appears in
                your liked posts (https://e621.net/post?tags=fav{{
                  encodedUsername
                }}).
              </div>
              <ol>
                <li>
                  Log in to your e621.net account
                  <external-link href="https://e621.net/user/login"
                    >here</external-link
                  >.
                </li>
                <li>
                  Go to
                  <external-link href="https://e621.net/user/api_key"
                    >your api keys</external-link
                  >and generate a new api key if you don't already have one.
                </li>
                <li>Type in your user name and paste your API key.</li>
                <li>
                  Add a proxy. You can keep this value if you trust
                  cors-anywhere.herokuapp.com with your credentials
                  <span class="red--text"
                    >(I don't know the owner of cors-anywhere)</span
                  >. If you use a different proxy, add the first part of the url
                  (usually https://example.com (will become
                  https://example.com/favorite/create.json) or
                  https://example.com/https://e621.net (will become
                  https://example.com/https://e621.net/favorite/create.json)).
                </li>
                <li>Change your API key regularly for added security.</li>
              </ol>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="" flat @click.native="open = false">Close</v-btn>
            <v-btn
              color="primary"
              flat
              @click.native="logIn"
              :disabled="
                usernameInput.length == 0 ||
                  keyInput.length == 0 ||
                  proxyInput.length == 0
              "
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>

<script>
// import _ from "lodash";
import { GETTERS, ACTIONS } from "../../store/constants";

const credentialManagementApiAvailable = !!window.PasswordCredential;

export default {
  data() {
    return {
      open_: false,
      detailsOpen: false,
      show2: true,
      favoritesLoading: false,
      usernameInput: "",
      proxyInput: "https://cors-anywhere.herokuapp.com/https://e621.net",
      keyInput: "",
      rules: {
        required: (value) => !!value || "Required",
      },
    };
  },
  methods: {
    async doAutoLogIn() {
      if (credentialManagementApiAvailable) {
        // using credential management api
        const cred = await navigator.credentials.get({
          password: true,
        });
        if (cred) {
          this.$store.dispatch(ACTIONS.LOG_IN, {
            username: cred.id,
            apiKey: cred.password,
            proxy: cred.name,
          });
          // since we have all credentials already, don't open the dialog
          return;
        }
      }
      this.open = true;
    },
    // viewFavorites() {
    //   this.$store.dispatch("resetNoResults");
    //   this.$router.push({
    //     query: {
    //       ...this.$store.state.routerModule.query,
    //       tags: `fav:${this.$store.state.settings.username}`,
    //     },
    //   });
    //   this.$store.dispatch("loadPosts", { reset: true });
    // },
    goToPostSuggester() {
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
        },
        path: "/suggester",
      });
    },
    async logOut() {
      this.$store.dispatch(ACTIONS.LOG_OUT);
      this.usernameInput = "";
      this.proxyInput = "https://cors-anywhere.herokuapp.com/https://e621.net";
      this.keyInput = "";
      this.open = false;
      if (credentialManagementApiAvailable) {
        await navigator.credentials.preventSilentAccess();
      }
    },
    async logIn() {
      if (credentialManagementApiAvailable) {
        let cred = new PasswordCredential({
          id: this.usernameInput,
          password: this.keyInput,
          name: this.proxyInput,
          iconURL: `${this.$baseUrl}/static/64x64.png`,
        });
        await navigator.credentials.store(cred);
      }
      this.$store.dispatch(ACTIONS.LOG_IN, {
        username: this.usernameInput,
        apiKey: this.keyInput,
        proxy: this.proxyInput,
      });
      this.open = false;
    },
    fetchFavorites() {
      this.favoritesLoading = true;
      this.$store.dispatch("fetchFavorites").then(() => {
        this.favoritesLoading = false;
      });
    },
  },
  computed: {
    encodedUsername() {
      return this.usernameInput
        ? // ? encodeURIComponent(`:${this.usernameInput}`)
          `:${this.usernameInput}`
        : ":username";
    },
    loggedIn() {
      return this.$store.getters[GETTERS.IS_LOGGED_IN];
    },
    open: {
      get() {
        return this.open_;
      },
      set(val) {
        this.open_ = val;
      },
    },
  },
  name: "LoginDialog",
};
</script>

<style lang="stylus" scoped></style>
