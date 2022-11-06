<template>
  <div></div>
</template>

<script>
import _ from 'lodash'
import NetworkRun from './NetworkRun.vue'

export default {
  name: 'NetworConfig',
  props: {
  },
  components: {
    NetworkRun
  },
  data () {
    return {
      accessIp: null
    }
  },
  created () {
    const sysConfig = this.$store.getters.sysConfig
    if (sysConfig && sysConfig.accessIp) {
      this.accessIp = sysConfig.accessIp
    } else {
      this.accessIp = '127.0.0.1'
    }
  },
  computed: {
    accessAddress () {
      const port = _.get(this.data, 'port', '')
      if (!port) {
        return ''
      }
      return this.accessIp + ':' + port
    }
  },
  methods: {
    getNetwork (productId, defaultValue) {
      if (!productId) {
        this.$message.error('请指定产品ID')
        return Promise.reject(new Error('请指定产品ID'))
      }
      return this.$http.get(`product/network/${productId}`)
      .then(data => {
        var result = null
        if (data.result) {
          if (data.result.configuration) {
            data.result.configuration = JSON.parse(data.result.configuration)
          } else {
            data.result.configuration = _.cloneDeep(defaultValue).configuration
          }
          result = data.result
        } else {
          result = _.cloneDeep(defaultValue)
        }
        return result
      })
    },
    updateNetwork (saveData) {
      if (!saveData.configuration.useTLS) {
        saveData.configuration.certificate = null
      }
      saveData.configuration = JSON.stringify(saveData.configuration)
      return this.$http.put(`product/network`, saveData).then((resp) => {
        return resp
      })
    }
  }
}
</script>
