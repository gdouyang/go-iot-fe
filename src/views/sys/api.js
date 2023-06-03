import Vue from 'vue'

export const roleTableUrl = '/role/page'
export const userTableUrl = '/user/page'

export function getAllRole () {
  return Vue.prototype.$http.post(`/role/page`, { pageNum: 1, pageSize: 10000, condition: [] })
}

export function getRole (id) {
  return Vue.prototype.$http.get(`/role/${id}`)
}

export function editRole (data) {
  return Vue.prototype.$http.put(`/role`, data)
}

export function addRole (data) {
  return Vue.prototype.$http.post(`/role`, data)
}

export function removeRole (id) {
  return Vue.prototype.$http.delete(`/role/${id}`)
}

export function getRoleRelMenus (id) {
  return Vue.prototype.$http.get(`/role/ref-menus/${id}`)
}

export function getMenus () {
  return Vue.prototype.$http.get(`/menu/list`)
}

export function getUser (id) {
  return Vue.prototype.$http.get(`/user/${id}`)
}

export function editUser (data) {
  return Vue.prototype.$http.put(`/user`, data)
}

export function addUser (data) {
  return Vue.prototype.$http.post(`/user`, data)
}

export function enableUser (id) {
  return Vue.prototype.$http.put(`/user/enable/${id}`)
}

export function disableUser (id) {
  return Vue.prototype.$http.put(`/user/disable/${id}`)
}

export function removeUser (id) {
  return Vue.prototype.$http.delete(`/user/${id}`)
}
