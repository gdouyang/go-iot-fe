import Vue from 'vue'
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

export function getMetaconfig (id) {
  return Vue.prototype.$http.get(`/product/${id}`).then(resp => {
    if (resp.success && resp.result) {
      return resp.result.metaconfig ? resp.result.metaconfig : []
    }
    return []
  })
}

export function modifyTsl (id, data) {
  return Vue.prototype.$http.put(`/product/${id}/modify-tsl`, data)
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
