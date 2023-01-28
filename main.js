import App from './App'

import Vue from 'vue'
// 1. 引入组件库
import cwUI from '@/uni_modules/cw-ui'
import customTabBar from '@/components/custom-tab-bar/index'

Vue.config.productionTip = false
App.mpType = 'app'
// 2. 注册
Vue.use(cwUI)
Vue.component('tab-bar',customTabBar)

const app = new Vue({
    ...App
})

app.$mount()
