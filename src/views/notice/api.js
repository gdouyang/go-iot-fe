import Vue from 'vue'

export function remove (id) {
  return Vue.prototype.$http.delete(`/notifier/config/${id}`)
}

export function get (id) {
  return Vue.prototype.$http.get(`/notifier/config/${id}`)
}

export function start (id) {
  return Vue.prototype.$http.post(`/notifier/config/${id}/start`)
}

export function stop (id) {
  return Vue.prototype.$http.post(`/notifier/config/${id}/stop`)
}

export function addNotify (data) {
  return Vue.prototype.$http.post(`/notifier/config`, data)
}

export function updateNotify (id, data) {
  return Vue.prototype.$http.put(`/notifier/config/${id}`, data)
}

export function configTypes () {
  return Vue.prototype.$http.get(`/notifier/config/types`)
  .then(res => {
    return res.result
  })
}
