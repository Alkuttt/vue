import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/font/iconfont.css'
import './assets/css/global.less'
import axios from 'axios'
import SocketService from "@/utils/socket_service";
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.instance
// 请求基准路径的配置
axios.default.baseURL = 'http://127.0.0.1:8888/api/'
Vue.prototype.$http = axios       // 将axios挂载到Vue原型对象上
Vue.prototype.$echarts = window.echarts       // 将全局的echarts对象挂载到Vue的原型对象上

Vue.config.productionTip = false
new Vue({
  el:'#app',
  router,
  render: h => h(App),
}).$mount('#app')
