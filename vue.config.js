// 打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
// 去除console
const TerserPlugin = require('terser-webpack-plugin')
// 开启gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

module.exports = {
  productionSourceMap: !IS_PROD,
  transpileDependencies: IS_PROD ? [] : [],
  configureWebpack: config => {
    const plugins = []
    // cdn引入
    config.externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios'
    }
    if (IS_PROD) {
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            elementUI: {
              name: 'chunk-elementUI',
              priority: 20,
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: 'all'
            }
          }
        },
        // 去除console
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        ]
      }
      // 开启gzip压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: config => {
    const cdn = {
      // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
      js: [
        `${process.env.VUE_APP_LIBS}/vue/2.5.17/vue.min.js`,
        `${process.env.VUE_APP_LIBS}/vue-router/3.0.1/vue-router.min.js`,
        `${process.env.VUE_APP_LIBS}/vuex/3.0.1/vuex.min.js`,
        `${process.env.VUE_APP_LIBS}/axios/0.19.0/axios.min.js`
      ]
    }

    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      args[0].chunksSortMode = 'none'
      return args
    })

    config.resolve.symlinks(true)

    // 添加别名
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@scss', resolve('src/assets/scss'))
      .set('@components', resolve('src/components'))
      .set('@plugins', resolve('src/plugins'))
      .set('@middlewares', resolve('src/middlewares'))
      .set('@mixins', resolve('src/mixins'))
      .set('@router', resolve('src/router'))
      .set('@store', resolve('src/store'))
      .set('@utils', resolve('src/utils'))
      .set('@views', resolve('src/views'))

    // 打包分析
    if (IS_PROD) {
      config.optimization.delete('splitChunks')
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  },
  lintOnSave: false,

  css: {
    modules: false,
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      sass: {
        data: `
        @import "@scss/variables.scss";
        @import "@scss/mixins.scss";
        `
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API || 'http://127.0.0.1:8080',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
