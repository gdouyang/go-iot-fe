<template>
  <div></div>
</template>

<script>
// import _ from 'lodash'
export default {
  name: 'ProductMix',
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
    doDeploy (id) {
      return this.$http.put(`product/${id}/deploy`)
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
        }
        return data
      })
    },
    doUndeploy (id) {
      return this.$http.put(`product/${id}/undeploy`)
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
        }
        return data
      })
    }
  }
}
</script>
