# dodo-repair-web

> jamesgame

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#该页面为资产详情页，目前只有资产，需要通过拼接url传参。
##该链接地址为：http地址/details?后拼接参数
##目前参数有： \perjectId  项目ID
###            \secret  
###            \FmId   资产ID
###            \code   资产code码
#地址示例：http://172.16.1.21:8080/details?perjectId=Pj1101080001&secret=123&FmId=Pe408470a74a0a4106a9d572c2ee274957&code=CCA
