<template>
  <a-spin tip="加载中..." :spinning="loading">
    <PageHeaderWrapper
      :style="{marginTop: 0, backgroundColor: '#F0F2F5', paddingBottom: 10}"
      @back="back"
    >
      <div :style="{marginTop: 30}" slot="title">
        <a-row>
          <span class="detail-title">
            <span>产品：{{ detailData.name }}</span>
          </span>
          <a-badge :color="detailData.state === 1 ? 'green' : 'red'" :text="detailData.stateI18n" style="margin-left: 10px"/>
          <a-popconfirm
            title="确认停用？"
            @confirm="unDeploy"
            v-if="detailData.state === 1">
            <a style="font-size: 12px;margin-left: 10px;">停用</a>
          </a-popconfirm>
          <a-popconfirm
            title="确认发布？"
            @confirm="deploy"
            v-if="detailData.state !== 1">
            <a style="font-size: 12px;margin-left: 10px;">发布</a>
          </a-popconfirm>
          <a-tooltip title="修改物模型后需要重新应用配置" placement="bottom">
            <a-popconfirm
              title="确认重新应用该配置？"
              @confirm="deploy"
              v-if="detailData.state === 1">
              <a style="font-size: 12px;margin-left: 10px;">应用配置</a>
            </a-popconfirm>
          </a-tooltip>
        </a-row>
      </div>
      <a-card :bordered="false">
        <a-tabs default-active-key="info">
          <a-tab-pane key="info" tab="基本信息">
            <Info :data="detailData" v-if="detailData.id" @refresh="reloadDevice"></Info>
          </a-tab-pane>
          <a-tab-pane key="tsl" tab="物模型">
            <TSL
              :data="detailData"
              :propertyData="properties"
              :functionsData="functions"
              :eventsData="events"
              :unitsData="units"
              @refresh="reloadDevice"
              @save="updateData"></TSL>
          </a-tab-pane>
          <a-tab-pane key="codec" tab="编解码" v-if="showCodec">
            <Codec
              :id="GetId"
              :data="detailData"
              @refresh="reloadDevice"
              @save="updateData"></Codec>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </PageHeaderWrapper>
  </a-spin>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import Info from './detail/Info.vue'
import TSL from './detail/TslIndex.vue'
import Codec from './detail/Codec.vue'

const statusMap = new Map()
statusMap.set('1', '已发布')
statusMap.set('0', '未发布')
export default {
  name: 'InsEditor',
  components: {
    PageHeaderWrapper,
    Info,
    TSL,
    Codec
  },
  data () {
    return {
      loading: true,
      detailData: {},
      properties: [],
      functions: [],
      events: [],
      tags: [],
      units: []
    }
  },
  mounted () {
    this.reloadDevice()
  },
  computed: {
    GetId () {
      return this.$route.query.id
    },
    showCodec () {
      const p = this.detailData.messageProtocol
      return p === 'tcp-server-script-protocol' ||
        p === 'tcp-client-script-protocol' ||
        p === 'OneNet' ||
        p === 'mqtt-server-script-protocol' ||
        p === 'websocket-server-script-protocol' ||
        p === 'http-server-script-protocol'
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    getDetail (id) {
      this.loading = true
      return this.$http.get(`/device-product/${id}`)
        .then((data) => {
          if (data.success) {
            return data.result
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    reloadDevice () {
      this.getDetail(this.GetId).then((result) => {
        if (result) {
          this.detailData = result
          if (result.metadata) {
            const metadata = result.metadata // JSON.parse(result.metadata)
            this.events = metadata.events
            this.functions = metadata.functions
            this.properties = metadata.properties
            this.tags = metadata.tags
          }
        }
      })
    },
    unDeploy () {
      const id = this.GetId
      this.$http.post(`/device-product/${id}/undeploy`)
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
          this.reloadDevice()
        }
      })
    },
    deploy () {
      const id = this.GetId
      this.$http.post(`/device-product/${id}/deploy`)
      .then((data) => {
        if (data.success) {
          this.$message.success('操作成功')
          this.reloadDevice()
        }
      })
    },
    updateData (type, item, onlySave) {
      const events = this.events
      const properties = this.properties
      const functions = this.functions
      const tags = this.tags
      let metadata = { events, properties, functions, tags }
      if (type === 'event') {
        metadata = { events: item, properties, functions, tags }
      } else if (type === 'properties') {
        metadata = { events, properties: item, functions, tags }
      } else if (type === 'function') {
        metadata = { events, properties, functions: item, tags }
      } else if (type === 'tags') {
        metadata = { events, properties, functions, tags: item }
      } else if (type === 'all') {
        metadata = { events: item.events, properties: item.properties, functions: item.functions, tags: item.tags }
      }
      const basicInfo = this.detailData
      const data = { ...basicInfo, metadata }
      this.$http.patch(`/device-product`, data)
      .then((re) => {
        if (re.success) {
          this.$message.success('保存成功，如需生效请重新应用配置')
          // if (!onlySave) {
          //   this.deploy(data)
          // }
        }
      })
    },
    toProductPage () {}
  }
}
</script>

<style lang="less" scoped>
.deviceInsTitle {
  display: flex;
  flex-direction: column;
}
</style>
