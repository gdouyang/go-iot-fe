import Vue from 'vue'

export function remove (id) {
  return Vue.prototype.$http.delete(`/alarm/${id}`)
}

export function start (id) {
  return Vue.prototype.$http.post(`/alarm/${id}/start`)
}

export function stop (id) {
  return Vue.prototype.$http.post(`/alarm/${id}/stop`)
}

export function addAlarm (data) {
  return Vue.prototype.$http.post(`/alarm`, data)
}

export function updateAlarm (id, data) {
  return Vue.prototype.$http.put(`/alarm/${id}`, data)
}

export function getAlarmList (target, targetId) {
  return Vue.prototype.$http.get(`/alarm/${target}/${targetId}`)
}

export function solveAlarmLog (id, targetId) {
  return Vue.prototype.$http.put(`/alarm/log/${id}/solve`)
}
