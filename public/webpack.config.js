/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "src/ts/main.ts"),
  },
  devtool: false,
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        exclude: /node_modules/i,
        use: "ts-loader",
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "static/dist"),
    filename: "[name].js",
    clean: true,
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/i,
    poll: 200,
    aggregateTimeout: 200,
  },
};
