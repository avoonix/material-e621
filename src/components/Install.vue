<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center row fill-height>
      <v-flex>
        <v-flex v-if="installPrompt" md6 xs12 offset-md3 class="pa-2">
          <v-card>
            <v-card-title>Install the {{ appName }} Web App</v-card-title>
            <v-card-text>
              <div class="mb-3">
                If you are using Chrome or any other browser that supports PWA
                install prompts (also known as A2HS), you can install this app.
                For more information, visit
                <external-link
                  href="https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive/Add_to_home_screen"
                  >this MDN page</external-link
                >.
              </div>
              <div>
                On Windows 10 and Android, the app will look and behave like a
                native app and even appear on your home screen or start menu.
                Unlike native apps, Material e621 won't be able to access system
                resources - it's still just a website after all.
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="installClick" flat color="primary">Install</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex v-if="installPrompt" class="text-xs-center grey--text"
          >OR</v-flex
        >
        <v-flex md6 xs12 offset-md3 class="pa-2">
          <v-card>
            <v-card-title>Install the {{ appName }} bookmarklet</v-card-title>
            <v-card-text>
              <div class="mb-3">
                This bookmarklet opens {{ appName }} with tags/post parameters
                from currently open e621 page. I recommend setting
                <external-link href="https://e621.net/user/edit#user_per_page"
                  >e621 posts per page</external-link
                >to the same value as Material posts per page.
              </div>
              <div class="mb-3">
                When you are done tweaking the values below, drag the link to
                your browser's bookmarks bar. You can verify that everything
                worked by visiting
                <external-link href="https://e621.net/post">e621</external-link
                >and clicking the bookmark.
              </div>
              <v-text-field label="Bookmarklet name" v-model="name" />
              <v-switch
                class="mt-0"
                label="Ignore page numbers and always start with page 1"
                v-model="ignorePage"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />Drag this
              <v-icon>mdi-chevron-double-right</v-icon>
              <a :href="`javascript:(${bookmarkletFunction})();`">{{
                name.trim() || `Open with ${appName}`
              }}</a>
              <v-icon>mdi-chevron-double-left</v-icon>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex class="text-xs-center grey--text">OR</v-flex>
        <v-flex md6 xs12 offset-md3 class="pa-2">
          <v-card>
            <v-card-title
              >Install the {{ appName }} link replacer
              bookmarklet</v-card-title
            >
            <v-card-text>
              <div class="mb-3">
                This bookmarklet replaces all link to e621 with links to
                {{ appName }}
              </div>
              <div class="mb-3">
                When you are done tweaking the values below, drag the link to
                your browser's bookmarks bar. You can verify that everything
                worked by visiting
                <external-link href="https://e621.net/post">e621</external-link>
                and clicking the bookmark. After that, click on any post or tag
                to open it in {{ appName }}.
              </div>
              <v-text-field
                label="Bookmarklet name"
                v-model="linkReplacerName"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />Drag this
              <v-icon>mdi-chevron-double-right</v-icon>
              <a :href="`javascript:(${linkReplacerBookmarkletFunction})();`">{{
                linkReplacerName.trim() || `${appName} link replacer`
              }}</a>
              <v-icon>mdi-chevron-double-left</v-icon>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { getAppName, getBaseUrl } from '@/utilities/utilities';
import { defineComponent } from '@vue/composition-api';

// this function is converted to string and used for the bookmarklet
// [[ignorePageBool]] will be replaced by a boolean
const bookmarkletFunction = function () {
  let m = /https?:\/\/e621\.net\/post\/show\/(\d+)/.exec(window.location.href),
    a = "";
  if (m) {
    return (window.location.href =
      "[[baseUrl]]/#/e621?agree=true&fspost=" + m[1]);
  }
  m = /https?:\/\/e621\.net\/post\/index\/(\d+)\/(.*)\??/.exec(
    window.location.href,
  );
  if (m) {
    if (![[ignorePageBool]] && m[1] != 1) {
      a = "&pagination=true&mpages=" + m[1] + "&page=" + m[1];
    }
    return (window.location.href =
      "[[baseUrl]]/#/e621?agree=true&tags=" + m[2] + a);
  }
  window.location.href = "[[baseUrl]]/#/e621?agree=true";
};

// this function is converted to string and used for the link replacer
// [[baseUrl]] will be replaced
const linkReplacerBookmarkletFunction = function () {
  for (const a of document.querySelectorAll("a")) {
    if (a.href) {
      let match = /https?:\/\/e621\.net\/post\/search.*[?&]tags=(.*)($|&)/.exec(
        a.href,
      );
      if (match) {
        a.href = `[[baseUrl]]/#/e621?agree=true&tags=${match[1]}`;
        continue;
      }
      match = /https?:\/\/e621\.net\/post\/show\/(\d+)($|\?|\/)/.exec(a.href);
      if (match) {
        a.href = `[[baseUrl]]/#/e621?agree=true&fspost=${match[1]}`;
        continue;
      }
      match = /https?:\/\/e621\.net\/post\/index\/(\d+)(\/(.*))?($|\?)/.exec(
        a.href,
      );
      if (match) {
        a.href = `[[baseUrl]]/#/e621?agree=true&pagination=true&mpages=${
          match[1] || 1
        }&page=${match[1] || 1}&tags=${match[3]}`;
        continue;
      }
      console.info(a.href, "has not been replaced");
    }
  }
};

// window.addEventListener("beforeinstallprompt", () => {
//   if (navigator.storage && navigator.storage.persist)
//     navigator.storage.persist().then((granted) => {
//       if (granted) {
//         console.log(
//           "Storage will not be cleared except by explicit user action",
//         );
//       } else {
//         console.log("Storage may be cleared by the UA under storage pressure.");
//       }
//     });
// });

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

export default defineComponent({
  metaInfo: {
    title: "Install",
  },
  setup() {
    const appName = getAppName();

    return {
      appName,
    }
  },
  data() {
    return {
      name: `${getAppName()} bookmarklet`,
      ignorePage: false,
      installPrompt: false,
      linkReplacerName: `${getAppName()} link replacer`,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.installPrompt = !!deferredPrompt;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {},
  methods: {
    async installClick() {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
      this.installPrompt = false;
      clearInterval(this.interval);
    },
  },
  computed: {
    bookmarkletFunction() {
      return bookmarkletFunction
        .toString()
        .replace(/\n\s+/g, " ")
        .replace(/\[\[ignorePageBool\]\]/g, this.ignorePage ? "true" : "false")
        .replace(/\[\[baseUrl\]\]/g, getBaseUrl());
    },
    linkReplacerBookmarkletFunction() {
      return linkReplacerBookmarkletFunction
        .toString()
        .replace(/\n\s+/g, " ")
        .replace(/\[\[baseUrl\]\]/g, getBaseUrl());
    },
  },
});
</script>
