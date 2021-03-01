const { mode } = require('webpack-nano/argv')
const { merge } = require('webpack-merge')
const parts = require('./webpack.parts')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const cssLoaders = [parts.autoprefix(), 'fast-sass-loader']
const Dotenv = require('dotenv-webpack')
const path = require('path')
const webpack = require('webpack')

const commonConfig = (isDev) =>
  merge([
    {
      entry: {
        app: {
          import: [
            process.env.BROWSERSLIST_ENV === 'legacy' ? 'whatwg-fetch' : false,
            path.join(__dirname, 'src', 'index.js'),
          ].filter((x) => x),
          // dependOn: "vendor",
        },
        // vendor: [
        //   process.env.BROWSERSLIST_ENV === "legacy" ? "whatwg-fetch" : false,
        // ].filter((x) => x),
      },
      output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'build'),
        filename: isDev
          ? '[name].js'
          : `[name].[contenthash:5].${process.env.BROWSERSLIST_ENV}.js`,
        assetModuleFilename: isDev
          ? 'assets/[name][contenthash:5][ext]'
          : `assets/[name].[contenthash:5].${process.env.BROWSERSLIST_ENV}[ext]`,
      },
      plugins: [
        new Dotenv(),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
      resolve: {
        extensions: ['.js', '.jsx'],
        fallback: { assert: require.resolve('assert/') },
      },
      optimization: {
        runtimeChunk: { name: 'runtime' },
      },
    },
    parts.page({ title: 'Demo', isDev }),
    parts.extractCSS({ loaders: cssLoaders, isDev }),
    parts.loadImages({ limit: 1, isDev }),
    parts.loadJavaScript(),
    parts.packages(isDev),
    parts.setFreeVariable('HELLO', 'hello from config'),

    // parts.attachRevision(),
  ])

const productionConfig = () =>
  merge([
    {
      mode: 'production',
      plugins: [],
    },
  ])

const developmentConfig = () =>
  merge([
    {
      // entry: ["webpack-plugin-serve/client"],
      // devtool: false,
    },
    parts.devServer(),
  ])

const statusConfig = () =>
  merge({
    plugins: [new BundleAnalyzerPlugin()],
  })
const getConfig = (mode) => {
  const isDev = mode === 'development'
  switch (mode) {
    case 'prod:webview':
      process.env.BROWSERSLIST_ENV = 'webview'
      return merge(commonConfig(isDev), productionConfig())
    case 'prod:modern':
      process.env.BROWSERSLIST_ENV = 'modern'
      return merge(
        commonConfig(isDev),
        productionConfig(),
        false ? statusConfig() : []
      )
    case 'development':
      process.env.BROWSERSLIST_ENV = 'modern'
      return merge(commonConfig(isDev), developmentConfig(), { mode })
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`)
  }
}

module.exports = getConfig(mode)
