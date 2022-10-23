import _ from 'lodash'
import Vue from 'vue'
export function configTypes () {
  return Vue.prototype.$http.get(`/notifier/config/types`)
  .then(res => {
    return _.filter(res.result, r => r.id === 'email')
  })
}
