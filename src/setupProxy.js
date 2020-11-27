const { createProxyMiddleware } = require('http-proxy-middleware')

//dev
// module.exports = function (app) {
//   app.use(
//     '/rpcshuttleflow',
//     createProxyMiddleware({
//       target: 'https://dev.shuttleflow.io',
//       changeOrigin: true,
//       pathRewrite: {
//         '/rpcshuttleflow': '',
//       },
//       secure: false,
//     })
//   )
//   app.use(
//     '/rpcsponsor',
//     createProxyMiddleware({
//       target: 'http://23.102.224.244:8018',
//       changeOrigin: true,
//       pathRewrite: {
//         '/rpcsponsor': '',
//       },
//     })
//   )
// }

//prod
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
