<template>
  <v-flex>
    <v-text-field readonly :value="url" @click="copyUrlToClipboard" />
    <v-radio-group v-model="urlType">
      <v-radio
        v-for="option in radioOptions"
        :key="option.type"
        :label="option.display"
        :value="option.type"
      />
    </v-radio-group>
    <div class="body-1">
      <v-layout row wrap="">
        <v-flex
          class="pa-1"
          v-for="(button, index) in shareButtons"
          :key="index"
          xs12
          md6
        >
          <v-btn
            class="ma-0"
            :dark="button.dark"
            large
            block
            :color="button.color"
            @click="shareButtonClick(button)"
            :href="button.noPopup ? button.url : undefined"
          >
            <v-icon left>{{ button.icon }}</v-icon>
            {{ button.name }}
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
  </v-flex>
</template>

<script lang="ts">
import { snackbarService } from "@/services";
import { getAppName, getBaseUrl } from "@/misc/util/utilities";
import { computed, defineComponent, ref } from "@vue/composition-api";
import copyToClipboard from "clipboard-copy";

enum UrlTypes {
  image,
  e621,
  materialE621,
}

interface IButton {
  name: string;
  color: string;
  dark: boolean;
  url: string;
  icon: string;
  clipboard?: true;
  noPopup?: true;
}

export default defineComponent({
  props: {
    postId: {
      type: Number,
      required: true,
    },
    rawFileUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const url = computed(() => {
      switch (urlType.value) {
        case UrlTypes.materialE621:
          return `${getBaseUrl()}/#/posts?first_post=${props.postId}`;
        case UrlTypes.e621:
          return `https://e621.net/posts/${props.postId}`;
        case UrlTypes.image:
          return props.rawFileUrl;
      }
    });
    const urlType = ref(UrlTypes.e621);
    const radioOptions = computed(() => [
      {
        type: UrlTypes.materialE621,
        display: `Share link to the post on ${getAppName()}`,
      },
      {
        type: UrlTypes.e621,
        display: "Share link to the e621 page",
      },
      {
        type: UrlTypes.image,
        display: "Share link to raw image",
      },
    ]);

    const shareButtonClick = async (button: IButton) => {
      if (button.clipboard) {
        await copyUrlToClipboard();
        return;
      }
      if (button.noPopup) {
        return;
      }
      window.open(button.url, `Share to ${name}`, "width=600,height=400");
    };

    const copyUrlToClipboard = async () => {
      await copyToClipboard(url.value);
      snackbarService.addMessage("Link copied");
    };

    const shareButtons = computed(() => {
      const encodedUrl = encodeURIComponent(url.value);
      const unencodedText = "Check out this awesome post!";
      const text = encodeURIComponent(unencodedText);
      const rawUrl = encodeURIComponent(props.rawFileUrl);
      return [
        {
          name: "Twitter",
          color: "#1DA1F3",
          dark: true,
          url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
          icon: "mdi-twitter",
        }, // TODO:
        {
          name: "Reddit",
          color: "#F73F07",
          dark: true,
          url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${text}`,
          icon: "mdi-reddit",
        },
        {
          name: "Telegram",
          color: "#2A9ED0",
          dark: true,
          url: `https://telegram.me/share/url?url=${encodedUrl}&text=${text}`,
          icon: "mdi-telegram",
        },
        {
          name: "Email",
          color: "#b2b2b2",
          dark: false,
          url: `mailto:?&subject=${text}&body=${encodedUrl}`,
          icon: "mdi-email",
          noPopup: true,
        },
        {
          name: "Copy to clipboard",
          color: "#353535",
          dark: true,
          url: url.value,
          icon: "mdi-clipboard-text",
          clipboard: true,
        },
        {
          name: "Reverse Google search",
          color: "#999999",
          dark: false,
          url: `https://www.google.com/searchbyimage?image_url=${rawUrl}`,
          icon: "mdi-google",
        },
      ];
    });
    return {
      radioOptions,
      urlType,
      url,
      shareButtons,
      shareButtonClick,
      copyUrlToClipboard,
    };
  },
});
</script>
