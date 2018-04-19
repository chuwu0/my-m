import Vue from 'vue'
import axios from 'axios'
import vueAxios from 'vue-axios'
// import store '../store'

Vue.use(vueAxios, axios)
    // 创建axios实例

// const baseURL = process.env.NODE_ENV === "development" ? `http://localhost:${process.env.PORT}` : process.env.BASE_URL
const service = axios.create({
    // baseURL,
    timeout: 30000, // 请求超时时间
    withCredentials: true, //是否跨站点访问控制请求
})

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    // if (store.getters.token) {
    //   config.headers['X-Token'] = store.getters.token // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    // }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => response,
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default service