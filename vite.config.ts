import { defineConfig } from "vite";
import { createVuePlugin as vue } from "vite-plugin-vue2";
import * as path from "path";
import { execSync } from "child_process";
import eslintPlugin from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";

const VUE_APP_GIT_COMMIT_INFO = execSync(
  'git log -n 10 --pretty=format:";;;;;%H;%aI;%B"',
)
  .toString()
  .trim();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    VUE_APP_GIT_COMMIT_INFO: JSON.stringify(VUE_APP_GIT_COMMIT_INFO),
  },
  build: {
    target: "esnext",
    sourcemap: true,
  },
  plugins: [
    vue(),
    eslintPlugin({
      fix: true,
    }),
    VitePWA({
      devOptions: {
        // enabled: true,
      },
      workbox: {
        sourcemap: true,
        // cleanupOutdatedCaches: true,
      },
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        id: "/#/posts",
        name: "Material e621",
        short_name: "M e621",
        start_url: "/#/posts",
        scope: "/",
        display: "fullscreen",
        background_color: "#000000",
        theme_color: "#000000",
        description: "A customizable e621 client.",
        orientation: "any",
        lang: "en",
        icons: [
          {
            src: "/static/8x8.png",
            sizes: "8x8",
            type: "image/png",
          },
          {
            src: "/static/16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "/static/24x24.png",
            sizes: "24x24",
            type: "image/png",
          },
          {
            src: "/static/32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/static/48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/static/64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "/static/72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/static/96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/static/128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/static/144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/static/168x168.png",
            sizes: "168x168",
            type: "image/png",
          },
          {
            src: "/static/192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/static/256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/static/512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/static/1024x1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
          {
            src: "favicon.svg",
            sizes: "512x512",
            type: "image/svg",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
