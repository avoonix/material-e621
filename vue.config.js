const { execSync } = require("child_process");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const path = require("path");

// Only variables that start with VUE_APP_ will be statically embedded into the client bundle with webpack.DefinePlugin.
process.env.VUE_APP_GIT_COMMIT_HASH = execSync(
  'git log -n 10 --pretty=format:";;;;;%H;%aI;%B"',
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
