// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import MintUI from 'mint-ui'
import App from './App'
import router from './router'
// import store from './store'
import tools from 'utils/tools'
import axios from 'axios'
import vueAxios from 'vue-axios'
// import 'mint-ui/lib/style.css' //Mint-UI样式
// import 'src/config/rem' //rem移动端适配
// import 'src/plugins/element.used' //按需加载element
import './styles/cssreset.css' //cssreset
// import './assets/font/iconfont.css' //文字


// import 'vue-xlsx-table/dist/style.css'
// import vueXlsxTable from 'vue-xlsx-table'
// Vue.use(vueXlsxTable, { rABS: false }) //HTML5 FileReader API 有两个方法可以读取本地文件 readAsBinaryString 和 readAsArrayBuffer, 默认rABS为true，也就是使用readAsBinaryString

Vue.use(vueAxios, axios)

// Vue.use(MintUI)

const isDev = process.env.NODE_ENV === "development"

// router.beforeEach((to, from, next) => {
//     const fullPath = to.fullPath
//         // store.dispatch('SetCommon', fullPath)
//     const openId = tools.getCookie('openId')
//     if (isDev) {
//         tools.setCookie('openId', 'oj_Zcv7W88dU30bjlPyS9a_ynsNU')
//         return next()
//     }
//     const isAuthor = to.path == '/author'
//     if (isAuthor && !!openId) {
//         //to.path 是'/author'并且openId存在
//         next('/')
//         return false
//     }
//     if ((!openId || openId == 'undefined') && !isAuthor) {
//         //如果openId不存在，并且to.path 不是'/author'
//         tools.setCookie('beforeLoginUrl', fullPath)
//         next('/author')
//         return false
//     }
//     next()
// })


/* eslint-disable no-new */
new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount('#app')