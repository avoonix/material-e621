import { getTagColor } from "../utilities/vuePlugin";

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

const customBbElementGenerator = {
  color({ h, innerText, attributes }) {
    if (attributes && attributes.startsWith("=")) {
      let color = attributes.substring(1); // remove = from attributes
      if (
        ["artist", "character", "copyright", "species"].indexOf(color) != -1
      ) {
        color = getTagColor(color);
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
      const rowVal = {};
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

// [^] matches any character (including newline)
// . matchees any character except newline
const customMatchers = [
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
      if (typeof customBbElementGenerator[bbElement] == "function") {
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

const createTree = (h, text) => {
  const retVal = [];
  if (text) {
    // text doesn't contain any bb elements
    let customMatcherMatched = false;
    for (let i = 0; i < customMatchers.length; i++) {
      const matcherMatch = customMatchers[i].regex.exec(text);
      if (
        matcherMatch &&
        (!customMatchers[i].isValid || customMatchers[i].isValid(matcherMatch))
      ) {
        customMatcherMatched = true;
        const startIndex = text.indexOf(matcherMatch[0]);
        const endIndex = startIndex + matcherMatch[0].length;
        const textBefore = text.substring(0, startIndex);
        const textAfter = text.substring(endIndex);
        retVal.push(createTree(h, textBefore));
        retVal.push(customMatchers[i].render({ match: matcherMatch, h }));
        retVal.push(createTree(h, textAfter));
        break;
      }
    }
    if (!customMatcherMatched) {
      retVal.push(text);
    }
  }
  return retVal;
};

const parse = (h, text) => {
  return h("span", { style: { whiteSpace: "pre-wrap" } }, createTree(h, text));
};

export default parse;
