// import _ from 'lodash'
import Vue from 'vue'
export function listAllProject () {
  return Vue.prototype.$http.get(`/project/list`)
  .then(resp => {
    return resp.success ? resp.result : []
  })
}

export function listByProject (projectId) {
  return Vue.prototype.$http.get(`/device-group/list-by-project?projectId=${projectId}`)
  .then(resp => {
    return resp.success ? resp.result : []
  })
}
