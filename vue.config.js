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
        entry: path.join(__dirname, "src/misc/serviceWorker/index.ts"),
      }),
    ],
  },
  chainWebpack: (config) => {
    config.module
      .rule("dtext-rule")
      .test(/\.dtext$/)
      .use("dtext-loader")
      .loader("raw-loader");
  },
};
