const { addWebpackPlugin, override, addBabelPlugins } = require('customize-cra')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var git = require('git-rev-sync')

module.exports = override(
  addBabelPlugins('babel-plugin-styled-components'),
  addWebpackPlugin(
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      meta: {
        versin: git.short(),
      },
    })
  )
)
