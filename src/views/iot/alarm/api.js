import Vue from 'vue'

export function solveAlarmLog (id, targetId) {
  return Vue.prototype.$http.put(`/alarm/log/${id}/solve`)
}
