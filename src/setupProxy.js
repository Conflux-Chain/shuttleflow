const { createProxyMiddleware } = require('http-proxy-middleware')
console.log('start')

module.exports = function (app) {
  app.use(
    '/rpcshuttleflow',
    createProxyMiddleware({
<<<<<<< HEAD
      target: 'https://api.shuttleflow.io',
=======
      target: 'https://dev.shuttleflow.io',
>>>>>>> origin/master
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
<<<<<<< HEAD
      target: 'http://23.102.224.244:8019',
=======
      target: 'http://23.102.224.244:8018',
>>>>>>> origin/master
      changeOrigin: true,
      pathRewrite: {
        '/rpcsponsor': '',
      },
    })
  )
}
