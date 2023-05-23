// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import { STable, DictSelect, iDialog } from './components'
import _ from 'lodash'
import moment from 'moment'
import Doc from '@/views/doc/Doc.vue'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style

Vue.config.productionTip = false
Vue.prototype.$_ = _
Vue.prototype.$moment = moment
// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(Antd)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('s-table', STable)
Vue.component('PageTable', STable)
Vue.component('Dialog', iDialog)
Vue.component('dict-select', DictSelect)
Vue.component('Doc', Doc)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
