import Vue from 'vue'
import Router from 'vue-router'
// import * as _ from './hook'
/* mbiH5 */
const mbiH5 = () =>
    import ('views/mbiH5')
Vue.use(Router)

export const constantRouterMap = [{
    path: '/details',
    name: 'mbiH5',
    component: mbiH5
}]

export default new Router({
    mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})