<template>
  <div>
    <a-descriptions bordered :column="2" size="small">
      <span slot="title">
        移动OneNet
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openOneNetAdd">编辑</a-button>
      </span>
      <a-descriptions-item label="接口地址" :span="1">{{ data.apiAddress }}</a-descriptions-item>
      <a-descriptions-item label="apiKey" :span="1">{{ data.apiKey }}</a-descriptions-item>
      <a-descriptions-item label="通知Token" :span="1">{{ data.validateToken }}</a-descriptions-item>
      <a-descriptions-item label="aesKey" :span="1">{{ data.aesKey }}</a-descriptions-item>
      <a-descriptions-item label="说明" :span="2">{{ data.description }}</a-descriptions-item>
    </a-descriptions>
    <OneNetAdd ref="OneNetAdd" @success="getData"/>
  </div>
</template>

<script>
// import moment from 'moment'
import OneNetAdd from './OneNetAdd.vue'
export default {
  name: 'OneNet',
  props: {
    productId: {
      type: String,
      default: null
    }
  },
  components: {
    OneNetAdd
  },
  data () {
    return {
      data: {}
    }
  },
  created () {
    this.getData()
  },
  computed: {
  },
  methods: {
    getData () {
      if (!this.productId) {
        this.$message.error('请指定产品ID')
        return
      }
      this.$http.get(`one-net/${this.productId}`)
      .then(data => {
        this.data = data.result || {}
      })
    },
    openOneNetAdd () {
      this.$refs.OneNetAdd.open(this.productId)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
