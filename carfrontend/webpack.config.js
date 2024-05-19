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
    port: 4000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/, 
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    htmlPlugin,
    new ModuleFederationPlugin({
      name: "CarMicroFrontend",
      filename: "remoteEntry.js",
      exposes: {
        "./carLogic": "./src/carLogic"
      },
      remotes: {
        HomeMicroFrontend: "HomeMicroFrontend@http://home-navigation:3999/remoteEntry.js",
        RentalMicroFrontend: "RentalMicroFrontend@http://rentalfrontend:4001/remoteEntry.js",
        UserMicroFrontend: "UserMicroFrontend@http://userfrontend:4002/remoteEntry.js",
      },
      shared: { react: { singleton: true, eager: true }, "react-dom": { singleton: true, eager: true } },
    })
  ]
};
