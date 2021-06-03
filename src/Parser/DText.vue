<script lang="ts">
import { getTagColorFromCategory } from "@/misc/util/utilities";
import { computed, defineComponent } from "@vue/composition-api";
import { CreateElement } from "vue";
import ExternalLink from "@/App/ExternalLink.vue";

const validBbElements = [
  "b",
  "i",
  "u",
  "s",
  "o",
  "sup",
  "sub",
  "spoiler",
  "color",
  "quote",
  "code",
  "section",
  "table",
];

const customBbElementGenerator: {
  [idx: string]: (arg0: {
    h: CreateElement;
    innerText: string;
    attributes?: string;
  }) => void;
} = {
  color({ h, innerText, attributes }) {
    if (attributes && attributes.startsWith("=")) {
      let color = attributes.substring(1); // remove = from attributes
      if (
        ["artist", "character", "copyright", "species"].indexOf(color) != -1
      ) {
        color = getTagColorFromCategory(color);
      }
      return h("span", { style: `color: ${color}` }, createTree(h, innerText));
    }
    return h("span", {}, createTree(h, innerText));
  },
  o({ h, innerText }) {
    return h(
      "span",
      { style: { textDecoration: "overline" } },
      createTree(h, innerText),
    );
  },
  quote({ h, innerText }) {
    return h("v-card", { class: "elevation-8" }, [
      h("v-card-text", {}, createTree(h, innerText)),
    ]);
  },
  code({ h, innerText }) {
    return h("code", { class: "code" }, innerText);
  },
  spoiler({ h, innerText }) {
    return h("span", { class: "spoiler" }, createTree(h, innerText));
  },
  table({ h, innerText }) {
    const rows = innerText.split("\n");
    const headerColumns = rows[0].split("|");
    const header = [];
    const content = [];
    for (let j = 0; j < headerColumns.length; j++) {
      header.push({ text: headerColumns[j], value: j });
    }
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split("|");
      const rowVal: { [idx: string]: string } = {};
      for (let j = 0; j < columns.length; j++) {
        rowVal[j] = columns[j];
      }
      content.push(rowVal);
    }
    const columns = header.length;
    return h("v-data-table", {
      class: "elevation-1",
      scopedSlots: {
        items: (props) => {
          const row = [];
          for (let i = 0; i < columns; i++) {
            row.push(h("td", createTree(h, props.item[i])));
          }
          return row;
        },
      },
      props: {
        hideActions: true,
        items: content,
        headers: header,
      },
    });
  },
  section({ h, innerText, attributes }) {
    let title = "Click to expand";
    let expanded = false;
    if (attributes) {
      if (attributes.startsWith(",expanded")) {
        expanded = true;
      }
      const titleStartPosition = attributes.indexOf("=");
      if (titleStartPosition !== -1) {
        title = attributes.substring(titleStartPosition + 1);
      }
    }
    return h(
      "v-expansion-panel",
      {
        props: { popout: true, value: expanded ? 0 : -1 },
      },
      [
        h("v-expansion-panel-content", { class: "elevation-8" }, [
          h("div", { slot: "header" }, title),
          h("v-card", {}, [h("v-card-text", {}, createTree(h, innerText))]),
        ]),
      ],
    );
  },
};

const customMatchers: Array<{
  render: (arg0: { match: RegExpExecArray; h: CreateElement }) => void;
  name: string;
  regex: RegExp;
  isValid?: (match: RegExpExecArray) => boolean;
}> = [
  {
    name: "Code",
    regex: /`([^].*)`/i,
    render({ h, match }) {
      return customBbElementGenerator["code"]({ h, innerText: match[1] });
    },
  },
  {
    name: "Headers",
    regex: /^h([1-6])\.(.*)$/im,
    render({ h, match }) {
      return h(`h${match[1]}`, {}, createTree(h, match[2]));
    },
  },
  {
    name: "Lists",
    regex: /((^|\n)\*+\s+.+)+/im,
    render({ h, match }) {
      let retVal = [];
      const input = match[0].trim(); // removes \n
      const listRegex = /^(\*+)\s+(.+)/gim;
      let listMatch;
      while ((listMatch = listRegex.exec(input))) {
        const depth = listMatch[1].length - 1;
        const content = listMatch[2];
        retVal.push(
          h(
            "li",
            { style: { marginLeft: `${depth * 1}em` } },
            createTree(h, content),
          ),
        );
      }
      return h("ul", retVal);
    },
  },
  {
    name: "BBElements",
    regex: /\[(\w+)((=| \w+=|,\w+=).*?)?\][\n\s]*([^]*?)[\n\s]*\[(\/\1)\]/im,
    isValid: (match) => validBbElements.indexOf(match[1]) !== -1,
    render({ h, match }) {
      const bbElement = match[1];
      const attributes = match[2];
      const innerText = match[4];
      if (typeof customBbElementGenerator[bbElement] === "function") {
        return customBbElementGenerator[bbElement]({
          h,
          innerText,
          attributes,
        });
      }
      return h(bbElement, createTree(h, innerText));
    },
  },
  {
    name: "@Username",
    regex: /@([a-zA-Z0-9\-_~']+)/i,
    render({ h, match }) {
      return h(
        "external-link",
        {
          attrs: {
            href: `https://e621.net/user/show/${match[1]}`,
            target: "_blank",
          },
        },
        [h("b", match[0])],
      );
    },
  },
  {
    name: "URLs",
    regex: /("(.+?)":)?(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/,
    render({ h, match }) {
      return h(
        "external-link",
        {
          attrs: {
            href: match[3],
            target: "_blank",
          },
        },
        match[2] || match[3],
      );
    },
  },
  {
    name: "e621 URLs",
    regex: /"(.+?)":(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)/,
    render({ h, match }) {
      return h(
        "external-link",
        {
          attrs: {
            href: `https://e621.net${match[2]}`,
            target: "_blank",
          },
        },
        match[1],
      );
    },
  },
];

const createTree = (h: CreateElement, text: string): Array<any> => {
  const retVal = [];
  if (text) {
    let customMatcherMatched = false;
    for (const matcher of customMatchers) {
      const matcherMatch = matcher.regex.exec(text);
      if (matcherMatch && (!matcher.isValid || matcher.isValid(matcherMatch))) {
        customMatcherMatched = true;
        const startIndex = text.indexOf(matcherMatch[0]);
        const endIndex = startIndex + matcherMatch[0].length;
        const textBefore = text.substring(0, startIndex);
        const textAfter = text.substring(endIndex);
        retVal.push(createTree(h, textBefore));
        retVal.push(matcher.render({ match: matcherMatch, h }));
        retVal.push(createTree(h, textAfter));
        break;
      }
    }
    // for (let i = 0; i < customMatchers.length; i++) {
    // }
    if (!customMatcherMatched) {
      retVal.push(text);
    }
  }
  return retVal;
};

const fixEmojis = (text: string) => {
  return text.replace(/([\uf000-\uffff])/g, (char) =>
    String.fromCodePoint(char.codePointAt(0)! + 0x10000),
  );
};

export default defineComponent({
  components: {
    ExternalLink,
  },
  props: {
    text: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const fixedText = computed(() => fixEmojis(props.text));

    return {
      fixedText,
    };
  },
  render(h) {
    if (this.enabled) {
      return h(
        "span",
        { style: { whiteSpace: "pre-wrap" } },
        createTree(h, this.fixedText as string),
      );
    }
    // return <span style={{ whiteSpace: "pre-wrap" }} >{this.text}</span>;
    return h(
      "span",
      { style: { whiteSpace: "pre-wrap" } },
      this.fixedText as string,
    );
  },
});
</script>

<style lang="scss" scoped>
.spoiler {
  transition: background 0.3s ease-in-out, color 0.3s ease-in-out;

  a {
    transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
  }
}

.spoiler:not(:hover) {
  color: black;
  background-color: black;

  a {
    color: black;
  }
}
</style>
