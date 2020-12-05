<script>
import parse from "../utilities/dTextParser";
import { GETTERS } from "../store/constants";

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    enabled() {
      return this.$store.getters[GETTERS.IS_DTEXT_PARSER_ENABLED];
    },
    fixedText() {
      return this.fixEmojis(this.text);
    },
  },
  methods: {
    fixEmojis(text) {
      return text.replace(/([\uf000-\uffff])/g, (char) =>
        String.fromCodePoint(char.codePointAt(0) + 0x10000),
      );
    },
  },
  render(h) {
    if (this.enabled) {
      return parse(h, this.fixedText);
    }
    // return <span style={{ whiteSpace: "pre-wrap" }} >{this.text}</span>;
    return h("span", { style: { whiteSpace: "pre-wrap" } }, this.fixedText);
  },
};
</script>

<style lang="stylus" scoped>

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
