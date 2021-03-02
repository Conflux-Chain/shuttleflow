const { WebpackPluginServe } = require('webpack-plugin-serve')
const HtmlWebpackDeployPlugin = require('html-webpack-deploy-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpack = require('webpack')
const path = require('path')
const APP_SOURCE = path.join(__dirname, 'src')

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: process.env.PORT || 8080,
      host: 'localhost',
      historyFallback: true,
      static: './build', // Expose if output.path changes
      liveReload: true,
      waitForBuild: true,
      middleware: (app, builtins) => {
        app.use(
          builtins.proxy('/rpcshuttleflow', {
            target:
              'https://test.shuttleflow.confluxnetwork.org/rpcshuttleflow',
            changeOrigin: true,
            pathRewrite: {
              '/rpcshuttleflow': '',
            },
          })
        )
        app.use(
          builtins.proxy('/rpcsponsor', {
            changeOrigin: true,
            target: 'https://test.shuttleflow.confluxnetwork.org/rpcsponsor',
            pathRewrite: {
              '/rpcsponsor': '',
            },
          })
        )
      },
    }),
  ],
})

exports.page = ({ title, isDev }) => ({
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename:
        isDev || process.env.BROWSERSLIST_ENV === 'modern'
          ? 'index.html'
          : `index.${process.env.BROWSERSLIST_ENV}.html`,
      context: { title },
    }),
  ],
})

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: { plugins: [require('autoprefixer')()] },
  },
})
exports.extractCSS = ({ options = {}, loaders = [], isDev } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isDev
                    ? '[path][name]__[local]--[hash:base64:10]'
                    : '[hash:base64:5]',
                },
              },
            },
          ].concat(loaders),
          sideEffects: true,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDev
          ? '[name].css'
          : `[name].[contenthash:4].${process.env.BROWSERSLIST_ENV}.css`,
      }),
    ],
  }
}

exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: limit } },
      },
    ],
  },
})

exports.loadJavaScript = () => ({
  module: {
    rules: [
      // Consider extracting include as a parameter
      { test: /\.jsx?$/, include: APP_SOURCE, use: 'babel-loader' },
      // { test: /\.json$/, include: APP_SOURCE, use: 'json-loader' },
    ],
  },
})
exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: `git version: ${new GitRevisionPlugin().version()}`,
    }),
  ],
})

exports.setFreeVariable = (key, value) => {
  const env = {}
  env[key] = JSON.stringify(value)

  return {
    plugins: [new webpack.DefinePlugin(env)],
  }
}

exports.packages = function (isDev) {
  return {
    plugins: [
      new HtmlWebpackDeployPlugin({
        assets: {
          copy: [
            { from: './favicon.ico', to: 'favicon.ico' },
            { from: './img', to: 'img' },
          ],
        },
        packages: {
          react: {
            copy: [
              !isDev
                ? {
                    from: 'umd/react.production.min.js',
                    to: 'react.production.min.js',
                  }
                : {
                    from: 'umd/react.development.js',
                    to: 'react.development.js',
                  },
            ],
            scripts: {
              variableName: 'React',
              path: 'react.production.min.js',
              devPath: 'react.development.js',
            },
          },
          'react-dom': {
            copy: [
              !isDev
                ? {
                    from: 'umd/react-dom.production.min.js',
                    to: 'react-dom.production.min.js',
                  }
                : {
                    from: 'umd/react-dom.development.js',
                    to: 'react-dom.development.js',
                  },
            ],
            scripts: {
              variableName: 'ReactDOM',
              path: 'react-dom.production.min.js',
              devPath: 'react-dom.development.js',
            },
          },
          recoil: {
            copy: [
              !isDev
                ? {
                    from: 'umd/recoil.min.js',
                    to: 'recoil.min.js',
                  }
                : {
                    from: 'umd/recoil.js',
                    to: 'recoil.js',
                  },
            ],
            scripts: {
              variableName: 'Recoil',
              path: 'recoil.min.js',
              devPath: 'recoil.js',
            },
          },
        },
      }),
    ],
  }
}
