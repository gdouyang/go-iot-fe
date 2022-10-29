import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import qs from 'qs'
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 20000, // 请求超时时间
  paramsSerializer: {
    serialize: function (params) {
      return qs.stringify(params)
    }
  }
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.destroy()
      notification.error({
        message: '403无权限',
        description: data.message
      })
    } else if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.destroy()
      notification.error({
        message: '未登录',
        description: '请先登录'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    } else if (typeof data === 'string') {
      notification.error({
        message: data
      })
    } else if (data && !data.success) {
      notification.error({
        message: data.message
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  const data = response.data
  if (data && !data.success && data.code !== '404' && data.message) {
    notification.destroy()
    notification.error({
      message: data.message
    })
    return Promise.reject(data.message)
  }
  return data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
