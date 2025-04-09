import { createHead } from '@unhead/vue/client'
export * from "./vuetify";
import "./mousetrap";
// TODO: maybe migrate to https://github.com/jaywcjlove/hotkeys-js

export const head = createHead({
  init: [
    {
      title: "Home",
      titleTemplate: "%s | Material e621",
    }
  ]
})
