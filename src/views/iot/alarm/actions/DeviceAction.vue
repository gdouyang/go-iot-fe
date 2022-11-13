<template>
  <div>
    <a-col :span="4">
      <a-input
        placeholder="点击选择设备"
        v-model="deviceData.name"
        :disabled="true"
      >
        <a-icon slot="addonAfter" type="api" @click="selectDevice" title="点击选择设备"></a-icon>
      </a-input>
    </a-col>
    <a-col :span="4" v-if="deviceData.name">
      <a-select
        placeholder="选择类型，如：属性/功能"
        :defaultValue="messageTypeDefaultValue"
        @change="messageTypeChange">
        <a-select-option value="WRITE_PROPERTY">设置属性</a-select-option>
        <a-select-option value="INVOKE_FUNCTION">调用功能</a-select-option>
      </a-select>
    </a-col>
    <div v-show="messageType === 'WRITE_PROPERTY'">
      <a-col :span="4">
        <a-select
          placeholder="物模型属性"
          :value="propertiesDefaultValue"
          @change="propertiesDataChange"
        >
          <a-select-option v-for="item in properties" :key="item.id" :value="item.id">{{ item.name }}({{ item.id }})</a-select-option>
        </a-select>
      </a-col>
      <Properties :propertiesData="propertiesData" :actionData="actionData" :arrayData.sync="arrayData" v-if="propertiesData.valueType"/>
    </div>
    <div v-show="messageType === 'INVOKE_FUNCTION'">
      <a-col :span="4">
        <a-select
          placeholder="物模型功能"
          :value="functionDefaultValue"
          @change="functionIdChange"
        >
          <a-select-option template v-for="item in functions" :key="item.id" :value="item.id">{{ item.name }}({{ item.id }})</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="24" v-for="(item, index) in functionData.inputs" :key="`function_${item.id}_${index}`">
        <div>
          <a-col :span="4">
            <a-input :value="`${item.name}(${item.id})`" :readOnly="true"/>
          </a-col>
          <FunctionOnType :item="item" :index="index" :actionData="actionData" />
        </div>
      </a-col>
    </div>

    <DeviceSelect @select="select" ref="DeviceSelect"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { WRITE_PROPERTY, INVOKE_FUNCTION } from './data.js'
import Properties from './DeviceProperties.vue'
import FunctionOnType from './DeviceFunction.vue'
import DeviceSelect from '@/views/iot/device/DeviceSelect.vue'
export default {
  name: 'DeviceAction',
  props: {
    actionData: {
      type: Object,
      default: null
    }
  },
  components: {
    Properties,
    FunctionOnType,
    DeviceSelect
  },
  computed: {
    messageTypeDefaultValue () {
      const message = this.actionData.configuration.message
      return message && message.messageType || undefined
    },
    propertiesDefaultValue () {
      return this.propertiesData.id || undefined
    },
    functionDefaultValue () {
      const message = this.actionData.configuration.message
      return message && message.functionId || undefined
    }
  },
  created () {
    const deviceId = this.actionData.configuration.deviceId
    if (deviceId) {
      this.findDevice(deviceId)
    }
  },
  data () {
    return {
      messageType: null,
      deviceData: {
        name: null,
        metadata: {
          properties: [],
          functions: []
        }
      },
      propertiesData: {},
      arrayData: [],
      functionData: {},
      properties: [],
      functions: []
    }
  },
  methods: {
    messageTypeChange (value) {
      this.messageType = value
      if (value === 'WRITE_PROPERTY') {
        this.actionData.configuration.message = WRITE_PROPERTY()
      } else if (value === 'INVOKE_FUNCTION') {
        this.actionData.configuration.message = INVOKE_FUNCTION()
      }
      this.propertiesData = {}
      this.functionData = {}
      this.actionData.configuration.message.messageType = value
    },
    selectDevice () {
      this.$refs.DeviceSelect.open()
    },
    select (item) {
      this.findDevice(item.id)
    },
    findDevice (deviceId) {
      this.$http.get(`/device/${deviceId}/detail`)
        .then((data) => {
          if (data.success) {
            const result = data.result
            if (result.metadata) {
              result.metadata = JSON.parse(result.metadata)
            } else {
              result.metadata = {
                properties: [],
                functions: []
              }
            }
            this.deviceData = result
            this.properties = result.metadata.properties
            this.functions = result.metadata.functions
            const actionData = this.actionData
            if (!actionData.configuration) {
              actionData.configuration = {}
            }
            this.arrayData = [undefined]
            if (actionData.configuration.deviceId) {
              const message = actionData.configuration.message
              this.messageType = message.messageType
              if (message.messageType === 'WRITE_PROPERTY') {
                _.forEach(result.metadata.properties, (item) => {
                  if (item.id === Object.keys(message.properties)[0]) {
                    this.propertiesData = item
                    if (item.valueType.type === 'array') {
                      this.arrayData = message.properties[item.id]
                    }
                  }
                })
              } else {
                _.forEach(result.metadata.functions, (item) => {
                  if (item.id === message.functionId) {
                    this.functionData = item
                  }
                })
              }
            }
            actionData.configuration.deviceId = deviceId
            actionData.configuration.productId = result.productId
          }
        })
    },
    propertiesDataChange (value) {
      const find = _.find(this.properties, p => p.id === value)
      if (find) {
        this.propertiesData = find
      }
      this.arrayData = [ undefined ]
      this.actionData.configuration.message.properties = {}
      // 清空服务调用
      this.actionData.configuration.message.functionId = null
      this.actionData.configuration.message.inputs = []
    },
    functionIdChange (value) {
      const find = _.find(this.functions, p => p.id === value)
      this.actionData.configuration.message.inputs = []
      if (find) {
        this.functionData = find
        _.forEach(find.inputs, func => {
          this.actionData.configuration.message.inputs.push({ name: func.id, value: undefined })
        })
      }
      this.actionData.configuration.message.functionId = value
      // 清空属性
      this.actionData.configuration.message.properties = {}
    }
  }
}
</script>
