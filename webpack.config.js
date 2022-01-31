const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");

const prod = process.argv[process.argv.indexOf("--mode") + 1] === "production";

module.exports = {
  entry: {
    main: "./src/main.ts",
  },
  devtool: "inline-source-map",
  output: {
    path: `${__dirname}/dist`,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: prod ? "tsconfig.prod.json" : "tsconfig.json",
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            Maxsize: 10 * 1024, // 10KB if the specified size is less than this value, the inline mode is used
          },
        },
      },
    ],
  },
  devServer: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    client: {
      overlay: { errors: true, warnings: false },
    },
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
    alias: {
      vue$: "vue/dist/vue.runtime.esm-bundler.js",
    },
    symlinks: false,
  },
  optimization: {
    splitChunks: {},
  },
  plugins: [
    new HtmlPlugin({
      template: "./index.html",
      filename: "index.html",
      title: "paletting",
      favicon: "./assets/favicon.ico",
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  stats: {
    errorDetails: true,
  },
};
