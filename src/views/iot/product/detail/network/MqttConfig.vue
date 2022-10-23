<template>
  <div>
    <a-descriptions bordered :column="2" size="small">
      <span slot="title">
        MQTT网络配置
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openAdd">编辑</a-button>
      </span>
      <a-descriptions-item label="开启SSL" :span="1">{{ data.configuration.ssl ? '是' : '否' }}</a-descriptions-item>
      <a-descriptions-item label="连接地址" :span="1">{{ accessAddress }}</a-descriptions-item>
      <a-descriptions-item label="最大消息长度" :span="1">{{ data.configuration.maxMessageSize }}</a-descriptions-item>
      <a-descriptions-item label="说明" :span="1">{{ data.description }}</a-descriptions-item>
    </a-descriptions>
    <MqttConfigAdd ref="MqttConfigAdd" @success="getData"/>
  </div>
</template>

<script>
// import moment from 'moment'
import MqttConfigAdd from './MqttConfigAdd.vue'
import { defaultMqttAddObj } from './entity.js'
import _ from 'lodash'

export default {
  name: 'MqttConfig',
  props: {
    productId: {
      type: String,
      default: null
    }
  },
  components: {
    MqttConfigAdd
  },
  data () {
    return {
      data: _.cloneDeep(defaultMqttAddObj),
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
    getData () {
      if (!this.productId) {
        this.$message.error('请指定产品ID')
        return
      }
      this.$http.get(`network/config/${this.productId}`)
      .then(data => {
        this.data = data.result || _.cloneDeep(defaultMqttAddObj)
      })
    },
    openAdd () {
      this.$refs.MqttConfigAdd.open(this.productId)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
