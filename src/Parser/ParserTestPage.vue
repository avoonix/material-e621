<template>
  <v-container fill-height>
    <v-layout>
      <v-flex>
        <v-textarea :rows="20" v-model="testText" label="Edit me"/>
        <d-text :text="testText" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { useUrlStore } from "@/services";
import { defineComponent } from "vue";
import DText from "./DText.vue";

export default defineComponent({
  metaInfo: {
    title: "Parser Test Page",
  },
  components: {
    DText,
  },
  data() {
    const urlStore = useUrlStore(); // todo: properly convert to vue 3 api
    return {
      testText: `
h1. Hello there
Edit this text and see the results below.

Some features listed "here":${urlStore.e621Url}help/show/dtext are not implemented:
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
});
</script>
