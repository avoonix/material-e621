<template>
  <div class="text-left">
    <v-card-text>
      <div class="mb-3">
        This bookmarklet opens {{ appName }} with tags/post parameters from the
        currently open e621 page. Drag the link to your browser's bookmarks bar.
      </div>
      <v-text-field label="Bookmarklet name" v-model="name" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />Drag this
      <v-icon>mdi-chevron-double-right</v-icon>
      <a :href="href">{{ linkName }}</a>
      <v-icon>mdi-chevron-double-left</v-icon>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { getAppName, getBaseUrl } from "@/misc/util/utilities";
import { computed, defineComponent, ref } from "vue";

const bookmarklet = `function bookmarklet() {
  let m = /https?:\\/\\/e621\\.net\\/(post\\/show|posts)\\/(\\d+)/.exec(window.location.href);
  if (m) {
    window.location.href = "[[baseUrl]]/#/posts?tags=id%3A" + m[2];
    return;
  }
  m = /https?:\\/\\/e621\\.net\\/(post\\/index|posts)(\\/)?.*tags=([-a-zA-Z_.+)(]+?)(&|$)/.exec(window.location.href);
  if (m) {
    window.location.href = "[[baseUrl]]/#/posts?tags=" + m[3];
    return;
  }
  window.location.href = "[[baseUrl]]/#/posts";
}`;

export default defineComponent({
  metaInfo: {
    title: "Install",
  },
  setup() {
    const appName = getAppName();

    const initialName = `Open with ${appName}`;

    const name = ref(initialName);

    const bookmarkletFunction = computed(() =>
      bookmarklet
        .replace(/\n\s+/g, " ")
        .replace(/\[\[baseUrl\]\]/g, getBaseUrl()),
    );
    const href = computed(() => `javascript:(${bookmarkletFunction.value})();`);
    const linkName = computed(() => name.value.trim() || initialName);

    return {
      appName,
      name,
      href,
      linkName,
    };
  },
});
</script>
