<template>
  <a-spin tip="加载中..." :spinning="loading">
    <PageHeaderWrapper
      :style="{marginTop: '0px', backgroundColor: '#F0F2F5', paddingBottom: '10px'}"
      :tabList="tableList"
      :tabActiveKey="ActiveTabKey"
      @tabChange="onTabChange"
      @back="back"
    >
      <span slot="extra">
        <a-tooltip title="刷新">
          <a-icon type="sync" :style="{fontSize: '20px'}" @click="reloadDevice"/>
        </a-tooltip>
      </span>
      <div slot="title">
        <a-row>
          <span class="detail-title">
            <span>设备：{{ GetDeviceId }}</span>
          </span>
          <a-badge :color="GetDeviceStatus === 'success' ? 'green' : 'red'" :text="GetDeviceStatusText" style="margin-left: 10px"/>
          <a-popconfirm
            title="确认让此设备断开连接？"
            @confirm="disconnectDevice"
            v-if="GetDeviceStatus === 'success'">
            <a style="font-size: 12px;margin-left: 10px;">断开连接</a>
          </a-popconfirm>
          <a-popconfirm
            title="确认激活此设备？"
            @confirm="changeDeploy"
            v-if="GetDeviceStatus === 'processing'">
            <a style="font-size: 12px;margin-left: 10px;">激活设备</a>
          </a-popconfirm>
        </a-row>
      </div>
      <div slot="content">
        <a-descriptions :column="4">
          <a-descriptions-item label="ID">{{ detailData.id }}</a-descriptions-item>
          <a-descriptions-item label="产品">
            <div>
              {{ detailData.productName }}
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <template v-if="ActiveTabKey === 'info'">
        <Info :data="detailData" v-if="detailData.id" @refresh="reloadDevice"></Info>
      </template>
      <template v-if="ActiveTabKey === 'status'">
        <Status :device="detailData" @refresh="reloadDevice"></Status>
      </template>
      <template v-if="ActiveTabKey === 'function'">
        <Function :device="detailData"></Function>
      </template>
      <template v-if="ActiveTabKey === 'log'">
        <Log :deviceId="detailData.id" v-if="detailData.id"></Log>
      </template>
      <template v-if="ActiveTabKey === 'alarm'">
        <DeviceAlarm
          target="device"
          :productId="detailData.productId"
          :productName="detailData.productName"
          :targetId="detailData.id"
          :metaData="detailData.metadata"
          :name="detailData.name"
        ></DeviceAlarm>
      </template>
    </PageHeaderWrapper>
  </a-spin>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { get, disconnect, deploy } from '@/views/iot/device/api.js'
import Info from './detail/Info'
import Status from './detail/Status'
import Function from './detail/Function'
import Log from './detail/Log'
import DeviceAlarm from '@/views/iot/alarm/index.vue'

const statusMap = new Map()
statusMap.set('online', 'success')
statusMap.set('offline', 'error')
statusMap.set('notActive', 'processing')
export default {
  name: 'DeviceDetail',
  components: {
    PageHeaderWrapper,
    Info,
    Status, // ,
    Function,
    Log,
    DeviceAlarm
  },
  provide () {
    return {
      reloadFuncs: this.reloadFuncs
    }
  },
  data () {
    return {
      loading: true,
      detailData: {},
      ActiveTabKey: 'info',
      tableList: [
        { key: 'info', tab: '实例信息' },
        { key: 'status', tab: '运行状态' },
        { key: 'function', tab: '设备功能' },
        { key: 'log', tab: '日志' },
        { key: 'alarm', tab: '告警设置' }
      ],
      reloadFuncs: new Map()
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.getDeviceDetail(id).then((result) => {
      if (result) {
        this.detailData = result
      }
    })
  },
  computed: {
    GetDeviceId () {
      return this.$route.query.id
    },
    GetDeviceStatus () {
      const status = (this.detailData.state) ? this.detailData.state : ''
      return statusMap.get(status)
    },
    GetDeviceStatusText () {
      return this.detailData.state
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    onTabChange (key) {
      if (!this.detailData.metadata) {
        this.$message.error('请检查产品物模型')
        return
      }
      this.ActiveTabKey = key
    },
    getDeviceDetail (id) {
      this.loading = true
      return get(id)
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
      this.getDeviceDetail(this.GetDeviceId).then((result) => {
        if (result) {
          this.detailData = result
        }
      })
      this.reloadFuncs.forEach((fun) => {
        fun()
      })
    },
    disconnectDevice () {
      const deviceId = this.GetDeviceId
      disconnect(deviceId).then(data => {
        if (data.success) {
          this.$message.success('断开连接成功')
          this.reloadDevice()
        }
      })
    },
    changeDeploy () {
      const deviceId = this.GetDeviceId
      deploy(deviceId).then((data) => {
        if (data.success) {
          this.$message.success('激活成功')
          this.reloadDevice()
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
