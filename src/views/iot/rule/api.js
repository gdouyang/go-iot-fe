import Vue from 'vue'

export const tableUrl = '/rule/page'

export function remove (id) {
  return Vue.prototype.$http.delete(`/rule/${id}`)
}

export function get (id) {
  return Vue.prototype.$http.get(`/rule/${id}`)
}

export function start (id) {
  return Vue.prototype.$http.post(`/rule/${id}/start`)
}

export function stop (id) {
  return Vue.prototype.$http.post(`/rule/${id}/stop`)
}

export function addScene (data) {
  return Vue.prototype.$http.post(`/rule`, data)
}

export function updateScene (id, data) {
  return Vue.prototype.$http.put(`/rule/${id}`, data)
}
