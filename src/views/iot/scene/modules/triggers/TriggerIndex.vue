<template>
  <div>
    <p style="font-size: 16px;">触发条件</p>
    <a-card size="small" :bordered="false" style="background-color: #eee;">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-switch
            v-model="shakeLimit.enabled"
            checkedChildren="开启防抖"
            unCheckedChildren="关闭防抖"
            style="margin-left: 20px;"
          />
          <template v-if="shakeLimit.enabled">
            <a-input
              v-model="shakeLimit.time"
              style="width: 70px; margin-left: 3px"
              size="small"
            />
            <small style="margin: 0px 5px;">秒内发生</small>
            <a-input
              v-model="shakeLimit.threshold"
              style="width: 70px;"
              size="small"
            />
            <small style="margin: 0px 5px;">次及以上时，处理</small>
            <a-radio-group
              v-model="shakeLimit.alarmFirst"
              size="small"
              buttonStyle="solid"
            >
              <a-radio-button :value="true">第一次</a-radio-button>
              <a-radio-button :value="false">最后一次</a-radio-button>
            </a-radio-group>
          </template>
        </a-col>
        <a-col :span="24" style="margin-top: 5px;">
          <a-col :span="4">
            <a-select v-model="scene.productId" @change="productIdChange" placeholder="产品">
              <a-select-option v-for="p in productList" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-input
              placeholder="点击选择设备"
              v-model="scene.deviceName"
              :disabled="true"
            >
              <a-icon slot="addonAfter" type="api" @click="selectDevice" title="点击选择设备"></a-icon>
            </a-input>
          </a-col>
          <a-col :span="4" v-if="scene.deviceId">
            <a-select
              placeholder="选择类型，如：属性/事件"
              v-model="scene.filterType"
              @change="triggerTypeChange"
            >
              <a-select-option value="online">上线</a-select-option>
              <a-select-option value="offline">离线</a-select-option>
              <a-select-option value="properties" v-if="metaData.properties">属性</a-select-option>
              <a-select-option value="event" v-if="metaData.events">事件</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4" v-if="scene.trigger.filterType === 'properties'">
            <a-select
              placeholder="物模型属性"
              v-model="scene.modelId"
              @change="modelIdPropertiesChange"
            >
              <a-select-option v-for="item in metaData.properties" :key="item.id" :value="item.id">
                {{ `${item.name}（${item.id}）` }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4" v-else-if="scene.trigger.filterType === 'event'">
            <a-select
              placeholder="物模型事件"
              v-model="scene.modelId"
              @change="modelIdEventChange"
            >
              <a-select-option v-for="item in metaData.events" :key="item.id" :value="item.id">
                {{ `${item.name}（${item.id}）` }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-col>
        <a-col
          :span="24"
          style="margin-top: 5px;"
          v-for="(item, index) in scene.trigger.filters"
          :key="index">
          <a-col :span="4">
            <a-select
              placeholder="过滤条件KEY"
              v-model="item.key"
              @change="filterKeyChange($event, item)"
            >
              <a-select-option v-for="d in dataSource" :value="d.id" :key="d.id">{{ d.id }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4" >
            <a-select
              placeholder="操作符"
              v-model="item.operator"
            >
              <a-select-option value="eq">等于(=)</a-select-option>
              <a-select-option value="not">不等于(!=)</a-select-option>
              <a-select-option value="gt">大于(>)</a-select-option>
              <a-select-option value="lt">小于(&lt;)</a-select-option>
              <a-select-option value="gte">大于等于(>=)</a-select-option>
              <a-select-option value="lte">小于等于(&lt;=)</a-select-option>
              <a-select-option value="like">模糊(%)</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-select
              v-if="item.valueType.type === 'boolean' && !$_.isNil(item.valueType.trueValue) && !$_.isNil(item.valueType.falseValue)"
              placeholder="过滤条件值"
              v-model="item.value"
            >
              <a-select-option :key="item.valueType.trueValue+''">
                {{ `${item.valueType.trueText}（${item.valueType.trueValue}）` }}
              </a-select-option>
              <a-select-option :key="item.valueType.falseValue+''">
                {{ `${item.valueType.falseText}（${item.valueType.falseValue}）` }}
              </a-select-option>
            </a-select>
            <a-input-number
              v-else-if="['float', 'double'].indexOf(item.valueType.type) !== -1"
              v-model="item.value"
              placeholder="过滤条件值"
              style="width: 150px;"
            />
            <a-input-number
              v-else-if="['int', 'long'].indexOf(item.valueType.type) !== -1"
              v-model="item.value"
              :precision="0"
              :step="1"
              placeholder="过滤条件值"
              style="width: 150px;"
            />
            <a-input
              v-else
              placeholder="过滤条件值"
              v-model="item.value"
            />
          </a-col>
          <a-col :span="5">
            <a @click="removeFilter(index)">删除</a>
          </a-col>
        </a-col>
        <a-col :span="24">
          <div>
            <a @click="addFilter">添加</a>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <DeviceSelect @select="select" :productId="scene.productId" ref="DeviceSelect"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { getDetail, getProductList } from '@/views/iot/device/api.js'
import { newFilter } from './data'
import DeviceSelect from '@/views/iot/device/DeviceSelect.vue'

export default {
  name: 'SceneTrigger',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  components: {
    DeviceSelect
  },
  data () {
    return {
      metaData: {
        events: [],
        functions: [],
        properties: []
      },
      dataSource: [],
      shakeLimit: {
        enabled: false,
        time: undefined,
        threshold: undefined,
        alarmFirst: true
      },
      scene: {},
      productList: []
    }
  },
  created () {
    this.scene = this.data
    const metadata = this.metaData
    const scene = this.scene
    const trigger = this.scene.trigger
    if (metadata) {
      let data = null
      if (trigger.filterType === 'event') {
        data = metadata['events']
      } else if (trigger.filterType === 'function') {
        data = metadata['functions']
      } else {
        data = metadata[trigger.filterType]
      }
      if (data) {
        this.dataSource = []
        data.map((item) => {
          if (item.id === scene.modelId) {
            this.setDataSourceValue(trigger.filterType, item, scene.modelId)
          }
        })
      }
      this.shakeLimit = trigger.shakeLimit
      const deviceId = scene.deviceId
      if (deviceId) {
        this.findDevice(deviceId)
      }
      if (_.isNil(trigger.filters)) {
        this.scene.filters = []
      } else {
        // 回显触发器filter
        _.forEach(trigger.filters, f => {
          const data = _.find(this.dataSource, d => d.id === f.key)
          f.valueType = (data && (data.valueType || {})) || {}
        })
      }
    }
    this.listAllProduct()
  },
  methods: {
    triggerTypeChange (value) {
      this.scene.filters = []
    },
    modelIdPropertiesChange (value) {
      const data = _.find(this.metaData.properties, p => p.id === value)
      if (data) {
        this.setDataSourceValue('properties', data, value)
      }
      const f = newFilter()
      f.valueType = {}
      this.scene.filters = [f]
    },
    modelIdEventChange (value) {
      const data = _.find(this.metaData.events, p => p.id === value)
      if (data) {
        this.setDataSourceValue('event', data, value)
      }
      const f = newFilter()
      f.valueType = {}
      this.scene.filters = [f]
    },
    removeFilter (index) {
      this.scene.filters.splice(index, 1)
    },
    addFilter () {
      const f = newFilter()
      f.valueType = {}
      this.scene.filters.push(f)
    },
    filterKeyChange (value, item) {
      if (item) {
        const data = _.find(this.dataSource, d => d.id === value)
        if (data) {
          item.valueType = data.valueType || {}
        }
        item.value = undefined
      } else {
        console.warn('filterKeyChange => item is null')
      }
    },
    setDataSourceValue (type, data, value) {
      this.dataSource = []
      const dataSource = this.dataSource
      dataSource.push({ id: value, valueType: data.valueType })
      if (type === 'function') {
        if (data.output.type === 'object') {
          data.valueType.properties.map((p) => {
            dataSource.push({ id: `${value}.${p.id}`, valueType: p.valueType })
          })
        }
      } else if (type === 'event') {
        dataSource.push('this')
        if (data.valueType.type === 'object') {
          data.valueType.properties.map((p) => {
            dataSource.push({ id: `${p.id}`, valueType: p.valueType })
          })
        }
      } else if (type === 'properties') {
        if (data.valueType.type === 'object') {
          data.valueType.properties.map((p) => {
            dataSource.push({ id: `${value}.${p.id}`, valueType: p.valueType })
          })
        }
      }
    },
    selectDevice () {
      this.$refs.DeviceSelect.open()
    },
    select (item) {
      this.findDevice(item.id)
    },
    listAllProduct () {
      return getProductList().then((resp) => {
        if (resp.success) {
          this.productList = resp.result
        }
      })
    },
    productIdChange () {
      this.scene.deviceId = null
      this.scene.deviceName = null
    },
    findDevice (deviceId) {
      getDetail(deviceId).then((data) => {
        if (data.success) {
          const result = data.result
          if (result.metadata) {
            result.metadata = JSON.parse(result.metadata)
          } else {
            result.metadata = {
              properties: [],
              functions: [],
              events: []
            }
          }
          const device = this.scene
          device.deviceId = result.id
          device.deviceName = result.name
          device.productId = result.productId
          device.productName = result.productName
          this.metaData = result.metadata
        }
      })
    }
  }
}
</script>
