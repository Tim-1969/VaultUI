const path = require('path');
const webpack = require('webpack');
var os = require("os");

const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();

var babelOptions = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "corejs": { "version": 3 },
        "useBuiltIns": "usage",
        "targets": {
          "firefox": "78",
          "chrome": "84",
                    "safari": "11.1"

        }
      }
    ]
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/transform-runtime"]
  ]
};

let commitHash = gitRevisionPlugin.commithash();

module.exports = {
  mode: "production",
  cache: false,
  entry: './src/main.tsx',
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
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      }
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new TerserPlugin({
        terserOptions: {
          ecma: "2015"
        }
      }),
      new CssMinimizerPlugin(),
    ],
  },
};
