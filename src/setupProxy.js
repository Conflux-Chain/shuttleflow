const { createProxyMiddleware } = require('http-proxy-middleware')
console.log('start')

module.exports = function (app) {
  app.use(
    '/rpcshuttleflow',
    createProxyMiddleware({
      target: 'https://api.shuttleflow.io/?secretkey=ConfluxFDSiof0j20fJFDHbSkgnkl5gkGDSKL',
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
      target: 'http://23.102.224.244:8019',
      changeOrigin: true,
      pathRewrite: {
        '/rpcsponsor': '',
      },
    })
  )
}
