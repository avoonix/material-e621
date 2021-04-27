// const PrerenderSPAPlugin = require("prerender-spa-plugin");
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// const path = require("path");

const { execSync } = require("child_process");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const path = require("path");

// Only variables that start with VUE_APP_ will be statically embedded into the client bundle with webpack.DefinePlugin.
process.env.VUE_APP_VERSION = require("./package.json").version;

process.env.VUE_APP_GIT_TOTAL_COMMITS = execSync("git rev-list --count HEAD")
  .toString()
  .trim();

process.env.VUE_APP_GIT_COMMIT_SHORT_NAME = execSync("git describe --always")
  .toString()
  .trim();

process.env.VUE_APP_GIT_BRANCH_NAME = execSync(
  "git rev-parse --abbrev-ref HEAD",
)
  .toString()
  .trim();

module.exports = {
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, "src/worker/serviceWorker/index.ts"),
      }),
    ],
  },
  chainWebpack: (config) => {
    //     config.merge({
    //       output: {
    //         globalObject: `(typeof self !== 'undefined' ? self : this)`, // https://github.com/webpack/webpack/issues/6642
    //       },
    //     });

    config.module
      .rule("dtext-rule")
      .test(/\.dtext$/)
      .use("dtext-loader")
      .loader("raw-loader");

    //     if (
    //       process.env.NODE_ENV !== "development"
    //     )
    //       config.plugin("prerender").use(PrerenderSPAPlugin, [
    //         {
    //           // Required - The path to the webpack-outputted app to prerender.
    //           staticDir: path.join(__dirname, "dist"),
    //           // Required - Routes to render.
    //           routes: ["/#/e621?agree=true"],
    //           minify: {
    //             collapseBooleanAttributes: true,
    //             collapseWhitespace: true,
    //             decodeEntities: true,
    //             keepClosingSlash: true,
    //             sortAttributes: true,
    //           },
    //           server: {
    //             // Normally a free port is autodetected, but feel free to set this if needed.
    //             // port: 6968
    //           },
    //           renderer: new Renderer({
    //             maxConcurrentRoutes: 1,
    //             injectProperty: "__SPECIAL_OPTIONS",
    //             inject: {
    //               isPrerender: true, // available via window.__SPECIAL_OPTIONS.isPrerender
    //             },
    //             headless: true,
    //             renderAfterDocumentEvent: "render-event",
    //           }),
    //         },
    //       ]); // second argument is an array of arguments
    //   },
  },
};
