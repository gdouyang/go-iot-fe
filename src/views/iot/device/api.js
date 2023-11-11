import Vue from 'vue'

export const pageUrl = 'device/page'

// 分页查询
export function page (param) {
  return Vue.prototype.$http.post(`device/page`, param)
}
// 激活
export function deploy (id) {
  return Vue.prototype.$http.post(`device/${id}/deploy`)
}
// 停用
export function undeploy (id) {
  return Vue.prototype.$http.post(`device/${id}/undeploy`)
}

export function batchDeploy (ids) {
  return Vue.prototype.$http.post(`device/batch/deploy`, ids)
}

export function batchUndeploy (ids) {
  return Vue.prototype.$http.post(`device/batch/undeploy`, ids)
}

export function remove (id) {
  return Vue.prototype.$http.delete(`device/${id}`)
}

export function get (id) {
  return Vue.prototype.$http.get(`/device/${id}`)
}

export function getDetail (id) {
  return Vue.prototype.$http.get(`/device/${id}/detail`)
}

export function connect (deviceId) {
  return Vue.prototype.$http.post(`/device/${deviceId}/connect`)
}

export function disconnect (deviceId) {
  return Vue.prototype.$http.post(`/device/${deviceId}/disconnect`)
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
  return Vue.prototype.$http.post(`/device/${deviceId}/invoke`, params)
}

export function updateLocation (params) {
  return Vue.prototype.$http.post(`/device/location`, params)
}

export function queryProperty (deviceId, data) {
  return Vue.prototype.$http.post(getDevicePropertysUrl(deviceId), data)
}

export function queryEvent (deviceId, eventId, data) {
  return Vue.prototype.$http.post(getDeviceEventsUrl(deviceId, eventId), data)
}

export function queryLogs (deviceId, data) {
  return Vue.prototype.$http.post(getDeviceLogsUrl(deviceId), data)
}

export function getDeviceLogsUrl (deviceId) {
  return `/device/${deviceId}/logs`
}

export function getDevicePropertysUrl (deviceId) {
  return `/device/${deviceId}/properties`
}

export function getDeviceEventsUrl (deviceId, eventId) {
  return `/device/${deviceId}/event/${eventId}`
}

export function getEventBusUrl (deviceId, topic) {
  if (window.location.protocol.startsWith('https')) {
    return `wss://${window.location.host}/api/eventbus/${deviceId}/${topic}`
  }
  return `ws://${window.location.host}/api/eventbus/${deviceId}/${topic}`
}

export function getTemplateDownloadUrl (productId) {
  return `api/device/${productId}/template`
}

export function getImportResultUrl (token) {
  return `api/device/import-result/${token}`
}
// export function getEvent (deviceId, itemId) {
//   return Vue.prototype.$http.get(`/device/${ deviceId }/event/${ itemId }?format=true&pageSize=1`)
// }
