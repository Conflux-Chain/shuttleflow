const { createProxyMiddleware } = require('http-proxy-middleware')

//dev
module.exports = function (app) {
  app.use(
    '/rpcshuttleflow',
    createProxyMiddleware({
      target: 'https://dev.shuttleflow.io',
      changeOrigin: true,
      pathRewrite: {
        '/rpcshuttleflow': '',
      },
      secure: false,
    })
  )
  app.use(
    '/rpcsponsor',
    createProxyMiddleware({
      target: 'http://52.141.21.174:8019',
      // target: 'http://test.shuttleflow.confluxnetwork.org/',
      changeOrigin: true,
      pathRewrite: {
        '/rpcsponsor': '',
      },
    })
  )
}

//prod
// module.exports = function (app) {
//   app.use(
//     '/rpcshuttleflow',
//     createProxyMiddleware({
//       target: 'https://shuttleflow.io/',
//       changeOrigin: true,
//       secure: false,
//     })
//   )
//   app.use(
//     '/rpcsponsor',
//     createProxyMiddleware({
//       target: 'https://shuttleflow.io/',
//       changeOrigin: true,
//     })
//   )
// }
