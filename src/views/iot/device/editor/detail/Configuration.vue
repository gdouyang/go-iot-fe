<template>
  <div style="width: 100%;margin-top: 10px;" v-if="configuration.length">
    <a-descriptions :style="{marginBottom: 20}" :column="3" size="small">
      <span slot="title">
        配置
        <a-popconfirm title="确认重新应用该配置？" @confirm="changeDeploy" v-action:device-mgr:save>
          <a-button type="link" style="padding-right: 2px;">应用配置</a-button>
        </a-popconfirm>
        <a-tooltip title="修改配置后需重新应用后才能生效。">
          <a-icon type="question-circle-o"/>
        </a-tooltip>
        <span v-if="canResetConfig" v-action:device-mgr:save>
          <a-popconfirm title="确认恢复默认配置？" @confirm="configurationReset">
            <a-button type="link" style="padding-right: 2px;">恢复默认</a-button>
          </a-popconfirm>
          <a-tooltip :title="`该设备单独编辑过[${deviceConfigKeys}]，点击此将恢复成默认的配置信息，请谨慎操作。`">
            <a-icon type="question-circle-o"/>
          </a-tooltip>
        </span>
      </span>
    </a-descriptions>

    <a-descriptions bordered :column="2" title="">
      <a-descriptions-item v-for="(item, inx) in configuration" :key="inx">
        <span slot="label">
          <a-tooltip :title="item.desc">
            <span>{{ item.property }}</span>
          </a-tooltip>
          <a-button icon="edit" type="link" @click="editConfigItem(item)" v-action:device-mgr:save></a-button>
        </span>
        <span>{{ getValue(item) }}</span>
      </a-descriptions-item>
    </a-descriptions>

    <ConfigurationUpdate
      v-if="updateVisible"
      :deviceId="device.id"
      :data="configItem"
      :allConfig="deviceConfig"
      @close="() => {
        updateVisible = false
      }"
      @refresh="refresh"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { deploy, updateDevice } from '@/views/iot/device/api.js'
import { getMetaconfig } from '@/views/iot/product/api.js'
import ConfigurationUpdate from './ConfigurationUpdate.vue'
export default {
  name: 'Configuration',
  props: {
    device: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ConfigurationUpdate
  },
  data () {
    return {
      configuration: [],
      updateVisible: false,
      configItem: {}
    }
  },
  created () {
    this.GetData()
  },
  computed: {
    deviceConfig () {
      return this.device.metaconfig ? this.device.metaconfig : {}
    },
    canResetConfig () {
      return !_.isEmpty(this.deviceConfig)
    },
    deviceConfigKeys () {
      return _.keys(this.deviceConfig)
    },
    deviceId () {
      return this.device.id
    }
  },
  methods: {
    getValue (item) {
      const has = _.has(this.deviceConfig, item.property)
      let value = item.value
      if (has) {
        value = _.get(this.deviceConfig, item.property)
      }
      if (item.type === 'password' && !_.isEmpty(value)) {
        return '••••••'
      }
      return value
    },
    GetData () {
      const id = this.device.productId
      getMetaconfig(id).then(data => {
        this.configuration = data
      })
    },
    changeDeploy () {
      deploy(this.deviceId).then(data => {
        if (data.success) {
          this.$message.success('应用成功')
          this.refresh()
        }
      })
    },
    refresh () {
      this.$emit('refresh')
    },
    editConfigItem (item) {
      this.configItem = _.cloneDeep(item)
      const has = _.has(this.deviceConfig, item.property)
      if (has) {
        this.configItem.value = _.get(this.deviceConfig, item.property)
      }
      this.updateVisible = true
    },
    configurationReset () {
      updateDevice({
        id: this.deviceId,
        metaconfig: {}
      }).then(resp => {
        if (resp.success) {
          this.$message.success('恢复默认配置成功')
          this.refresh()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
