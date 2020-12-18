<template>
  <v-container fill-height>
    <v-layout>
      <v-flex>
        <v-flex xs12 sm6 offset-sm3 v-if="!enabled">
          <v-card>
            <v-card-title primary-title>
              <div class="title mb-2 red--text">DText parsing disabled</div>
            </v-card-title>
            <v-card-title class="mt-0 pt-0">
              <span class="grey--text"
                >Enable DText parsing in settings to use this page</span
              >
            </v-card-title>
          </v-card>
        </v-flex>
        <v-slider
          v-model="textRows"
          thumb-label
          :min="2"
          :max="50"
          label="Text field rows"
        ></v-slider>
        <v-textarea
          :rows="textRows"
          v-model="testText"
          label="Edit me"
        ></v-textarea>
        <d-text-display :text="testText" />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { GETTERS } from "../../store/constants";
import DTextDisplay from "../DTextDisplay.vue";

export default {
  metaInfo: {
    title: "Parser Test Page",
  },
  components: {
    DTextDisplay,
  },
  computed: {
    enabled() {
      return this.$store.getters[GETTERS.IS_DTEXT_PARSER_ENABLED];
    },
  },
  data() {
    return {
      textRows: 10,
      testText: `
h1. Hello there
Edit this text and see the results below. [b]Please report any errors in the e621 forum.[/b]

Some features listed "here":https://e621.net/help/show/dtext are not implemented:
* Some link syntaxes
* Custom titles
* Post Thumbnails
* Escaping DText
* Page Anchors


http://example.com
"A link":http://example.com/
"A link":/user/edit

[section]Pretend this is a really large block of text.[/section]
[section=Some Title]This one has a title.[/section]
[section,expanded=Title]This is expanded by default.[/section]

[b]Bold[/b]
[i]Italics[/i]
[u]Underline[/u]
[o]Overline[/o]
[s]Strikeout[/s]
[sup]Superscript[/sup]
[sub]Subscript[/sub]
[spoiler]I'm a spoiler![/spoiler]
[color=red]I'm red![/color]

[color=#ff0000]I'm red![/color]
[color=pink]I'm pink![/color]
[color=artist]artist[/color]
[color=character]character[/color]
[color=copyright]copyright[/color]
[color=species]species[/color]

[code]std::cout << "Hello, world!\\n";[/code]
\`inline       code\`
@username

[quote]Please quote me![/quote]
I'm quoting you!

h1.Header 1
h2.Header 2
h3.Header 3
h4.Header 4
h5.Header 5
h6.Header 6

* Item 1
* Item 2
** Item 2A
** Item 2B
* Item 3

[table]
header | header | header
 row   |   row  | row
 row   |   row  | row
[/table]
`,
    };
  },
  name: "ParserTestPage",
};
</script>
