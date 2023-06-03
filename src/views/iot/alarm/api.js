import Vue from 'vue'

export const pageUrl = '/alarm/log/page'

export function solveAlarmLog (id, data) {
  return Vue.prototype.$http.put(`/alarm/log/${id}/solve`, data)
}
