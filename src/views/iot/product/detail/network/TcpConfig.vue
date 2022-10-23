<template>
  <div>
    <a-descriptions bordered :column="2" size="small">
      <span slot="title">
        TCP网络配置
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openAdd">编辑</a-button>
      </span>
      <a-descriptions-item label="开启SSL" :span="1">{{ data.configuration.ssl ? '是' : '否' }}</a-descriptions-item>
      <a-descriptions-item label="解析方式" :span="1">{{ parserType(data.configuration.parserType) }}</a-descriptions-item>
      <a-descriptions-item label="连接地址" :span="1">{{ accessAddress }}</a-descriptions-item>
      <a-descriptions-item label="说明" :span="1">{{ data.description }}</a-descriptions-item>
    </a-descriptions>
    <TcpConfigAdd ref="TcpConfigAdd" @success="getData"/>
  </div>
</template>

<script>
// import moment from 'moment'
import TcpConfigAdd from './TcpConfigAdd.vue'
import { defaultTcpAddObj, parserType } from './entity.js'
import _ from 'lodash'

export default {
  name: 'TcpConfig',
  props: {
    productId: {
      type: String,
      default: null
    }
  },
  components: {
    TcpConfigAdd
  },
  data () {
    return {
      data: _.cloneDeep(defaultTcpAddObj),
      accessIp: null
    }
  },
  created () {
    this.getData()
    const sysConfig = this.$store.getters.sysConfig
    if (sysConfig && sysConfig.accessIp) {
      this.accessIp = sysConfig.accessIp
    } else {
      this.accessIp = '127.0.0.1'
    }
  },
  computed: {
    accessAddress () {
      const port = _.get(this.data, 'configuration.port', '')
      if (!port) {
        return ''
      }
      return this.accessIp + ':' + port
    }
  },
  methods: {
    parserType (type) {
      return parserType(type)
    },
    getData () {
      if (!this.productId) {
        this.$message.error('请指定产品ID')
        return
      }
      this.$http.get(`network/config/${this.productId}`)
      .then(data => {
        this.data = data.result || _.cloneDeep(defaultTcpAddObj)
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
