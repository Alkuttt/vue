//该文件用于创建Vuex中最为核心的store
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
//准备action--用于相应组件中的动作
const action = {}
//准备mutations——用于操作数据（state)
const mutations = {}
//准备state——存储数据
const state = {}
//创建store
export default new Vuex.Store({
    action,
    mutations,
    state
})