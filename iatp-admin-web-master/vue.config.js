module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://192.168.1.15:8080',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  }