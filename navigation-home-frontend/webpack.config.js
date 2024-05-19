const HtmlWebPackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");


const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
});

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, "public"),
    port: 3999,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Update the test property to include .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/, // Add this rule for CSS files
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    htmlPlugin,
    new ModuleFederationPlugin({
      name: "HomeMicroFrontend",
      filename: "remoteEntry.js",
      exposes: {
        "./navigation": "./src/navigation",
        "./home": "./src/home"
      },
      shared: { react: { singleton: true, eager: true }, "react-dom": { singleton: true, eager: true } },
    })
  ]
};
