const path = require("path");
module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./scripts/main.js"],
  output: {
    filename: "app.js",
    path: path.resolve(__dirname + "/scripts"),
  },
  devServer: {
    static: "./",
    port: 3000,
    hot: true,
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
