<template>
  <div>
    <a-descriptions bordered :column="2" size="small">
      <span slot="title">
        TCP网络配置
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openAdd">编辑</a-button>
        <NetworkRun :network="data" :productId="productId" @success="getData"/>
      </span>
      <a-descriptions-item label="开启SSL" :span="1">{{ data.configuration.useTLS ? '是' : '否' }}</a-descriptions-item>
      <a-descriptions-item label="解析方式" :span="1">{{ parserType(data.configuration.delimeter.type) }}</a-descriptions-item>
      <a-descriptions-item label="连接地址" :span="2">{{ accessAddress }}</a-descriptions-item>
    </a-descriptions>
    <TcpConfigAdd ref="TcpConfigAdd" @success="getData"/>
  </div>
</template>

<script>
// import moment from 'moment'
import TcpConfigAdd from './TcpConfigAdd.vue'
import { defaultTcpAddObj, parserType } from './entity.js'
import _ from 'lodash'
import Base from './base.vue'

export default {
  name: 'TcpConfig',
  props: {
    productId: {
      type: String,
      default: null
    }
  },
  mixins: [ Base ],
  components: {
    TcpConfigAdd
  },
  data () {
    return {
      data: _.cloneDeep(defaultTcpAddObj)
    }
  },
  created () {
    this.getData()
  },
  computed: {
  },
  methods: {
    parserType (type) {
      return parserType(type)
    },
    getData () {
      this.getNetwork(this.productId, defaultTcpAddObj)
      .then(data => {
        this.data = data
      })
    },
    openAdd () {
      this.$refs.TcpConfigAdd.open(this.productId)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
