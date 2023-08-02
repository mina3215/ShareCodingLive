const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/sharecodinglive', {
      target: 'http://i9d109.p.ssafy.io:8094/',
      pathRewrite: {
        '^/sharecodinglive': '',
      },
      changeOrigin: true,
    })
  );
};
