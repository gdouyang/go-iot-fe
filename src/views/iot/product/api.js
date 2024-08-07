import Vue from 'vue'

export const tableUrl = 'product/page'
/**
 * deploy product
 * @param {*} id
 */
export function deploy (id) {
  return Vue.prototype.$http.post(`product/${id}/deploy`)
}
/**
 * undeploy product
 * @param {*} id
 */
export function undeploy (id) {
  return Vue.prototype.$http.post(`product/${id}/undeploy`)
}
/**
 * delete product by id
 * @param {*} id
 */
export function remove (id) {
  return Vue.prototype.$http.delete(`product/${id}`)
}

export function get (id) {
  return Vue.prototype.$http.get(`/product/${id}`)
}

export function getTsl (id) {
  return Vue.prototype.$http.get(`/product/${id}/tsl`)
}

export function getMetaconfig (id) {
  return Vue.prototype.$http.get(`/product/${id}`).then(resp => {
    if (resp.success && resp.result) {
      return resp.result.metaconfig ? resp.result.metaconfig : []
    }
    return []
  })
}

export function modifyTsl (id, data) {
  return Vue.prototype.$http.put(`/product/${id}/tsl`, data)
}

export function updateScript (id, data) {
  return Vue.prototype.$http.put(`/product/${id}/script`, data)
}

export function addProduct (data) {
  return Vue.prototype.$http.post(`/product`, data)
}

export function updateProduct (id, data) {
  return Vue.prototype.$http.put(`/product/${id}`, data)
}

export function getNetwork (id) {
  return Vue.prototype.$http.get(`/product/network/${id}`)
}

export function updateNetwork (saveData) {
  return Vue.prototype.$http.put(`/product/network`, saveData)
}

export function runNetwork (productId, state) {
  return Vue.prototype.$http.post(`product/network/${productId}/run?state=${state}`)
}

export function getExportUrl (productId) {
  return `api/product/${productId}/export`
}

export function uploadProduct (file) {
  const formData = new FormData()
  formData.append('file', file)
  return Vue.prototype.$http.post(`product/import`, formData)
}

export function getEventBusUrl (productId, deviceId, type) {
  if (window.location.protocol.startsWith('https')) {
    return `wss://${window.location.host}/api/eventbus/${productId}/${deviceId}/${type}`
  }
  return `ws://${window.location.host}/api/eventbus/${productId}/${deviceId}/${type}`
}
