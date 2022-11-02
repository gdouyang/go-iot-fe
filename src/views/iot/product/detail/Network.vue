<template>
  <div>
    <a-descriptions :style="{marginBottom: 20}" bordered :column="3" size="small">
      <span slot="title">
        网络配置
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openBasicInfo">编辑</a-button>
      </span>
      <TcpConfig v-if="network.type === 'TCP_SERVER'" :productId="data.id" />
      <MqttConfig v-if="network.type === 'MQTT_BROKER'" :productId="data.id" />
      <WebSocketConfig v-if="network.type === 'WEBSOCKET_SERVER'" :productId="data.id" />
      <HttpConfig v-if="network.type === 'HTTP_SERVER'" :productId="data.id" />
    </a-descriptions>
  </div>
</template>

<script>
// import moment from 'moment'
// import _ from 'lodash'
import TcpConfig from './network/TcpConfig.vue'
import MqttConfig from './network/MqttConfig.vue'
import WebSocketConfig from './network/WebSocketConfig.vue'
import HttpConfig from './network/HttpConfig.vue'

export default {
  name: 'InsEditorDetail',
  props: {
    product: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    TcpConfig,
    MqttConfig,
    WebSocketConfig,
    HttpConfig
  },
  data () {
    return {
      network: {

      }
    }
  },
  created () {
    this.GetData()
  },
  computed: {
  },
  methods: {
    GetData () {
      const { id } = this.data
      this.getNetwork(id).then(data => {
        if (data.success) {
          this.network = data.result || {}
        }
      })
    },
    getNetwork (id) {
      return this.$http.get(`/product/network/${id}`)
    },
    refresh () {
      this.$emit('refresh')
      this.GetData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
