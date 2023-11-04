import Vue from 'vue'

export const tableUrl = '/server/page'

export function getAllNetwork () {
  return Vue.prototype.$http.post(`/server/page`, { pageNum: 1, pageSize: 10000, condition: [] })
}

export function getNetwork (id) {
  return Vue.prototype.$http.get(`/server/${id}`)
}

export function editNetwork (data) {
  return Vue.prototype.$http.put(`/server`, data)
}

export function addNetwork (data) {
  return Vue.prototype.$http.post(`/server`, data)
}

export function removeNetwork (id) {
  return Vue.prototype.$http.delete(`/server/${id}`)
}
