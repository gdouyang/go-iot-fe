import Vue from 'vue'
export function deploy (id) {
  return Vue.prototype.$http.post(`device/${id}/deploy`)
}

export function undeploy (id) {
  return Vue.prototype.$http.post(`device/${id}/undeploy`)
}

export function remove (id) {
  return Vue.prototype.$http.delete(`device/${id}`)
}

export function get (id) {
  return Vue.prototype.$http.get(`/device/${id}`)
}

export function disconnect (deviceId) {
  return Vue.prototype.$http.put(`/device/${deviceId}/disconnect`)
}

export function addDevice (data) {
  return Vue.prototype.$http.post('/device', data)
}

export function updateDevice (data) {
  return Vue.prototype.$http.put('/device', data)
}

export function getProductList () {
  return Vue.prototype.$http.get('/product/list')
}

export function cmdInvoke (deviceId, params) {
  return Vue.prototype.$http.post(`/device/${deviceId}/cmd`, params)
}
