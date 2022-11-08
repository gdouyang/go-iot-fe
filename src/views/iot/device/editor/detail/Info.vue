<template>
  <div>
    <a-card :bordered="false">
      <a-descriptions bordered :column="3" size="small">
        <span slot="title">
          设备信息
          <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openBasicInfo">编辑</a-button>
        </span>
        <a-descriptions-item label="产品名称" :span="1">{{ data.productName }}</a-descriptions-item>
        <a-descriptions-item label="设备类型" :span="1">{{ data.deviceType ? data.deviceType.text : '' }}</a-descriptions-item>
        <a-descriptions-item label="连接协议" :span="1">{{ data.transport }}</a-descriptions-item>
        <a-descriptions-item label="消息协议" :span="1">{{ data.protocolName || data.protocol }}</a-descriptions-item>
        <a-descriptions-item label="IP地址" :span="1">{{ data.address }}</a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="1">{{ GetCreateTime }}</a-descriptions-item>
        <a-descriptions-item label="注册时间" :span="1">{{ GetRegisterTime }}</a-descriptions-item>
        <a-descriptions-item label="最后上线时间" :span="2">{{ GetLastOnlineTime }}</a-descriptions-item>
        <a-descriptions-item label="说明" :span="3">{{ data.describe || data.description }}</a-descriptions-item>
      </a-descriptions>

      <div style="width: 100%;margin-top: 10px;" v-if="configuration.length">
        <a-descriptions :style="{marginBottom: 20}" :column="3" size="small">
          <span slot="title">
            位置
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="editLocation">编辑</a-button>
          </span>
        </a-descriptions>
        <a-descriptions bordered :column="2" title="">
          <a-descriptions-item>
            <span slot="label">
              经度
            </span>
            <span>{{ extendData.longitude }}</span>
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label">
              纬度
            </span>
            <span>{{ extendData.latitude }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <div style="width: 100%;margin-top: 10px;" v-if="configuration.length">
        <a-descriptions :style="{marginBottom: 20}" :column="3" size="small">
          <span slot="title">
            配置
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="updateVisible = true;">编辑</a-button>
            <a-popconfirm title="确认重新应用该配置？" @confirm="changeDeploy">
              <a-button type="link">应用配置</a-button>
              <a-tooltip title="修改配置后需重新应用后才能生效。">
                <a-icon type="question-circle-o"/>
              </a-tooltip>
            </a-popconfirm>
            <template v-if="data.aloneConfiguration">
              <a-popconfirm title="确认恢复默认配置？" @confirm="configurationReset">
                <a-button type="link">恢复默认</a-button>
                <a-tooltip :title="`该设备单独编辑过${configuration.name}，点击此将恢复成默认的配置信息，请谨慎操作。`">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </span>
        </a-descriptions>

        <div v-for="(item,index) in configuration" :key="'configuration' + index">
          <h3>{{ item.name }}</h3>
          <a-descriptions bordered :column="2" title="">
            <a-descriptions-item
              v-for="(property, inx) in item.properties"
              :key="property.property + inx">
              <span slot="label">
                <span>{{ property.name }}</span>
                <a-tooltip :title="property.description">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </span>
              <span v-if="property.type && property.type.type == 'password' && data.configuration[property.property]">••••••</span>
              <span v-else>{{ data.configuration[property.property] }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-card>

    <DeviceAdd ref="DeviceAdd" @success="$emit('refresh')" v-if="addVisible" />
    <LocationConfig ref="LocationConfig" @success="selectLocation" />

    <Configuration
      v-if="updateVisible"
      :data="data"
      :configuration="configuration"
      @close="() => {
        updateVisible = false
        $emit('refresh')
      }"
      @save="updateData"/>
  </div>
</template>

<script>
import moment from 'moment'
import { deploy, updateDevice, getConfigMetadata, configReset, updateLocation } from '@/views/iot/device/api.js'
import DeviceAdd from '../../modules/DeviceAdd.vue'
import Configuration from './Configuration.vue'
import LocationConfig from '@/components/tools/LocationConfig.vue'

export default {
  name: 'DeviceInfo',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    DeviceAdd,
    Configuration,
    LocationConfig
  },
  data () {
    return {
      configuration: [],
      addVisible: false,
      updateVisible: false,
      extendData: {
        deviceId: null,
        longitude: null, // 经度
        latitude: null // 纬度
      }
    }
  },
  created () {
    this.GetData()
  },
  computed: {
    GetCreateTime () {
      return moment(this.data.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
    GetRegisterTime () {
      if (this.data.state) {
        return this.data.state !== 'notActive'
          ? moment(this.data.registerTime).format('YYYY-MM-DD HH:mm:ss')
          : '/'
      }
      return ''
    },
    GetLastOnlineTime () {
      if (this.data.state) {
        return this.data.state !== 'notActive'
          ? moment(this.data.onlineTime).format('YYYY-MM-DD HH:mm:ss')
          : '/'
      }
      return ''
    },
    deviceId () {
      const { id } = this.data
      return id
    }
  },
  methods: {
    GetData () {
      const id = this.deviceId
      getConfigMetadata(id).then(data => {
        if (data.success) {
          this.configuration = data.result || []
        }
      })
    },
    openBasicInfo () {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.DeviceAdd.edit(this.data)
      })
    },
    changeDeploy () {
      const { id } = this.data
      deploy(id).then(data => {
        if (data.success) {
          this.$message.success('应用成功')
          this.GetData()
          this.$emit('refresh')
        }
      })
    },
    configurationReset () {
      const { deviceId } = this.data
      configReset(deviceId).then(response => {
        if (response.status === 200) {
          this.$message.success('恢复默认配置成功')
          this.$emit('refresh')
        }
      })
    },
    updateData (item) {
      const param = {
        id: this.data.id,
        configuration: item.configuration
      }
      this.updateVisible = false
      updateDevice(param).then((response) => {
        if (response.status === 200) {
          this.$message.success('配置信息修改成功')
          this.$emit('refresh')
        }
      })
    },
    editLocation () {
      this.$refs.LocationConfig.open(this.extendData)
    },
    selectLocation (value) {
      const param = {
        deviceId: this.extendData.deviceId,
        longitude: value.longitude,
        latitude: value.latitude
      }
      updateLocation(param).then((resp) => {
        if (resp.success) {
          this.$message.success('操作成功')
          this.$refs.LocationConfig.close()
        } else {
          this.$message.success(resp.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
