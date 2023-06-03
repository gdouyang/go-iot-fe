import Vue from 'vue'

export function solveAlarmLog (id, data) {
  return Vue.prototype.$http.put(`/alarm/log/${id}/solve`, data)
}
