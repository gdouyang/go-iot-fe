<template>
  <div>
    <a-card :bordered="false" :style="{marginBottom: '20px'}">
      <a-descriptions :style="{marginBottom: 20}" bordered :column="3" size="small">
        <span slot="title">
          产品信息
          <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openBasicInfo">编辑</a-button>
        </span>
        <a-descriptions-item label="产品ID" :span="1">{{ data.id }}</a-descriptions-item>
        <!-- <a-descriptions-item label="所属品类" :span="1">{{ data.classifiedName }}</a-descriptions-item> -->
        <!-- <a-descriptions-item label="消息协议" :span="1">{{ data.protocolName || data.protocol }}</a-descriptions-item> -->
        <!-- <a-descriptions-item label="连接协议" :span="1">{{ data.transportProtocol }}</a-descriptions-item> -->
        <!-- <a-descriptions-item label="设备类型" :span="2">{{ data.deviceType.text }}</a-descriptions-item> -->
        <a-descriptions-item label="说明" :span="3">{{ data.desc }}</a-descriptions-item>
      </a-descriptions>
      <!-- 网络配置 -->
      <div style="width: 100%;margin-top: 10px;">
        <OneNet v-if="data.bindProvider && data.bindProvider === 'onenet'" :productId="data.id" />
        <TcpConfig v-if="data.messageProtocol === 'tcp-server-script-protocol'" :productId="data.id" />
        <!-- <TcpConfig v-if="data.messageProtocol === 'tcp-client-script-protocol'" :productId="data.id" /> -->
        <MqttConfig v-if="data.messageProtocol === 'mqtt-server-script-protocol'" :productId="data.id" />
        <WebSocketConfig v-if="data.messageProtocol === 'websocket-server-script-protocol'" :productId="data.id" />
        <HttpConfig v-if="data.messageProtocol === 'http-server-script-protocol'" :productId="data.id" />
      </div>

      <div style="width: 100%;margin-top: 10px;">
        <a-descriptions :style="{marginBottom: 20}" size="small">
          <span slot="title">
            配置
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="updateVisibleAdd = true;">添加</a-button>
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="updateVisible = true;" v-if="configuration.length > 0">编辑</a-button>
          </span>
        </a-descriptions>

        <div :style="{marginBottom: '20px'}" v-for="(item,index) in configuration" :key="'configuration' + index">
          <h3>{{ item.name }}</h3>
          <a-descriptions bordered :column="2" title="" size="small">
            <a-descriptions-item v-for="(property, inx) in item.properties" :key="property.property + inx">
              <span slot="label">
                <span>{{ property.name }}
                  <a-tooltip :title="property.description">
                    <a-icon type="question-circle-o"/>
                  </a-tooltip>
                </span>
              </span>
              <span v-if="property.type && property.type.type == 'password' && data.configuration[property.property]">••••••</span>
              <span v-else>{{ data.configuration[property.property] }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-card>

    <ProductAdd ref="ProductAdd" @success="refresh()" v-if="addVisible" />

    <Configuration
      v-if="updateVisible"
      :data="data"
      :configuration="configuration"
      @close="() => {
        updateVisible = false
        refresh()
      }"
      @save="updateData"/>
    <ConfigurationAdd
      v-if="updateVisibleAdd"
      :data="data"
      :all-config="configuration"
      @close="() => {
        updateVisibleAdd = false
        refresh()
      }"/>
  </div>
</template>

<script>
// import moment from 'moment'
// import _ from 'lodash'
import ProductAdd from '../modules/product-add.vue'
import Configuration from './configuration.vue'
import ConfigurationAdd from './configurationAdd.vue'
import OneNet from './cloud-bind/OneNet.vue'
import TcpConfig from './network/TcpConfig.vue'
import MqttConfig from './network/MqttConfig.vue'
import WebSocketConfig from './network/WebSocketConfig.vue'
import HttpConfig from './network/HttpConfig.vue'

export default {
  name: 'InsEditorDetail',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ProductAdd,
    Configuration,
    ConfigurationAdd,
    OneNet,
    TcpConfig,
    MqttConfig,
    WebSocketConfig,
    HttpConfig
  },
  data () {
    return {
      configuration: [],
      addVisible: false,
      updateVisible: false,
      updateVisibleAdd: false
    }
  },
  created () {
    this.GetData()
  },
  computed: {
  },
  methods: {
    GetData () {
      // const { id } = this.data
      // this.getConfiguration(id).then(data => {
      //   if (data.success) {
      //     this.configuration = data.result || []
      //   }
      // })
    },
    getConfiguration (id) {
      return this.$http.get(`/product/${id}/config-metadata`)
    },
    getNetwork (id) {
      return this.$http.get(`/product/network/${id}`)
    },
    openBasicInfo () {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.ProductAdd.edit(this.data)
      })
    },
    refresh () {
      this.$emit('refresh')
      this.GetData()
    },
    updateData (item) {
      // const list = _.filter(this.configuration, c => c.name !== item.name)
      // list.push(item)
      const param = {
        configuration: item.configuration
      }
      this.updateVisible = false
      this.$http.put(`/product/${this.data.id}`, param)
      .then((response) => {
        if (response.success) {
          this.$message.success('配置信息修改成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
