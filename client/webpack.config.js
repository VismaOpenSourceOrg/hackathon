const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

const BUILD_DATE = new Date();

module.exports = {
  entry: ["./src/index.js", "./sass/index.scss"],
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    proxy: [
      {
        context: ["/login", "/oauth-login-success", "/oauth2", "/api"],
        target: "http://localhost:8081"
      }
    ]
  },
  output: {
    filename: "js/[name].js",
    publicPath: "/",
    path: path.resolve(__dirname, "../src/main/resources/static"),
    crossOriginLoading: "anonymous"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./templates/index.html",
      inject: "body",
      filename: "index.html",
      hash: true,
      buildDate: BUILD_DATE
    }),
    new HtmlWebpackPlugin({
      template: "./templates/logged-out.html",
      filename: "logged-out.html",
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: "./templates/login-error.html",
      filename: "login-error.html",
      inject: false
    }),
    new SriPlugin({
      hashFuncNames: ["sha256", "sha384"]
    }),
    new MomentLocalesPlugin(),
    new CopyWebpackPlugin(
      [
        {
          from: "images",
          to: "images"
        }
      ],
      {}
    )
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};
