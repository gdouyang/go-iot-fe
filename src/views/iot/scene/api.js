import Vue from 'vue'

export function remove (id) {
  return Vue.prototype.$http.delete(`/scene/${id}`)
}

export function get (id) {
  return Vue.prototype.$http.get(`/scene/${id}`)
}

export function start (id) {
  return Vue.prototype.$http.post(`/scene/${id}/start`)
}

export function stop (id) {
  return Vue.prototype.$http.post(`/scene/${id}/stop`)
}

export function addScene (data) {
  return Vue.prototype.$http.post(`/scene`, data)
}

export function updateScene (id, data) {
  return Vue.prototype.$http.put(`/scene/${id}`, data)
}
