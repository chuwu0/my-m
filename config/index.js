// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var buildEnv = require('./prod.env')
var devEnv = require('./dev.env')
    //所有代理配置
const proxyTable = {
    '/api': {
        target: 'http://172.16.0.189:8080', //设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
            '^/api': '' //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
    },
    '/sass': {
        target: 'http://192.168.30.96:8080', //sass平台
        changeOrigin: true,
        pathRewrite: {
            '^/sass': ''
        }
    },
    '/img': {
        target: 'http://192.168.20.225:8080', //图片地址
        changeOrigin: true,
        pathRewrite: {
            '^/img': ''
        }
    },
    '/physics': {
        target: 'http://192.168.100.225:8080', //物理世界
        changeOrigin: true,
        pathRewrite: {
            '^/physics': ''
        }
    }
}

module.exports = {
    build: {
        env: buildEnv,
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        staticPath: './', //生产环境 staticPath:''
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: devEnv,
        autoOpenBrowser: true,
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        staticPath: '/',
        proxyTable: proxyTable,
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}