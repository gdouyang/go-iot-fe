<template>
  <div>
    <TcpConfig v-if="network.type === 'TCP_SERVER'" :productId="product.id" />
    <MqttConfig v-if="network.type === 'MQTT_BROKER'" :productId="product.id" />
    <WebSocketConfig v-if="network.type === 'WEBSOCKET_SERVER'" :productId="product.id" />
    <HttpConfig v-if="network.type === 'HTTP_SERVER'" :productId="product.id" />
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
      const { id } = this.product
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
