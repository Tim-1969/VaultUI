const path = require('path');
const webpack = require('webpack');
var os = require("os");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
let commitHash = gitRevisionPlugin.commithash();


module.exports = {
  mode: "development",
  cache: true,
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  stats: {
    colors: true,
    timings: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({ title: "VaultUI" }),
    new webpack.DefinePlugin({
      BUILD_STRING:
        JSON.stringify(`Built At: ${new Date().toString()} by ${os.userInfo().username}@${os.hostname()} on commit ${commitHash}`),
    })
  ],
  devServer: {
    open: process.env.BROWSER || "microsoft-edge-dev",
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js', ".mjs"],
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
    ],
  },
};