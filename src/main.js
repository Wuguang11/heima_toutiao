import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.less'
import MyIcon from '@/components/MyIcon.vue'
// 适配
import 'amfe-flexible'
// 全局样式
import '@/styles/index.less'
Vue.use(Vant)
// 全局图标
Vue.component('MyIcon', MyIcon)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
