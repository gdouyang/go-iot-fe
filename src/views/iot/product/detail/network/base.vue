<template>
  <div></div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'NetworConfig',
  props: {
  },
  components: {
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
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
          data.result.configuration = JSON.parse(data.result.configuration)
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
