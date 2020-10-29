const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/rpcshuttleflow',
    createProxyMiddleware({
      target: 'https://shuttleflow.io/',
      changeOrigin: true,
      secure: false,
    })
  )
  app.use(
    '/rpcsponsor',
    createProxyMiddleware({
      target: 'https://shuttleflow.io/',
      changeOrigin: true,
    })
  )
}
