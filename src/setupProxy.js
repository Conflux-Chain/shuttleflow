const { createProxyMiddleware } = require('http-proxy-middleware')
console.log('start')

module.exports = function (app) {
  app.use(
    '/rpcshuttleflow',
    createProxyMiddleware({
      target: 'https://dev.shuttleflow.io',
      pathRewrite: {
        '/rpcshuttleflow': '',
      },
      changeOrigin: true,
      secure: false,
    })
  )
  app.use(
    '/rpcsponsor',
    createProxyMiddleware({
      target: 'http://23.102.224.244:8018',
      changeOrigin: true,
      pathRewrite: {
        '/rpcsponsor': '',
      },
    })
  )
}
