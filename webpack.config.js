const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VERBOSE = Object.getOwnPropertyNames(process.env).includes("VERBOSE") || !true;
const MODE  = process.env.WEBPACK_MODE || "production" 
const DEBUG = MODE != "production";


module.exports = {
  mode: MODE,
  cache: DEBUG,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  stats: {
    preset: VERBOSE ? "detailed" : "normal",
    colors: true,
    timings: true,
  },
  plugins: [new MiniCssExtractPlugin(), new HtmlWebpackPlugin({ title: "VaultUI" })],
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
      { test: /\.tsx?$/, loader: "ts-loader" }
    ],
  },
};