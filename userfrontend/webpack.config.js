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
    port: 4002,
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
      name: "UserMicroFrontend",
      filename: "remoteEntry.js",
      exposes: {
        "./userLogic": "./src/userLogic"
      },
      remotes: {
        HomeMicroFrontend: "HomeMicroFrontend@http://localhost:3999/remoteEntry.js",
        CarFrontend: "CarFrontend@http://localhost:4000/remoteEntry.js",
        RentalFrontend: "RentalFrontend@http://localhost:4001/remoteEntry.js",
      },
      shared: { react: { singleton: true, eager: true }, "react-dom": { singleton: true, eager: true } },
    })
  ]
};
