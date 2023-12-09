<template>
  <div>
    <p style="font-size: 16px;">触发条件</p>
    <a-card size="small" :bordered="false" style="background-color: #eee;">
      <a-row :gutter="16">
        <a-col :span="24" v-if="false">
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
            <a-select
              v-model="scene.productId"
              @change="productIdChange"
              placeholder="产品"
              :class="{'v-error': !scene.productId}">
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
          <a-col :span="24">
            <div class="device-box">
              <a-tag color="blue" v-for="devId in scene.deviceIds" :key="devId" closable @close="removeDevice(devId)">
                {{ devId }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="4" v-if="scene.productId">
            <a-select
              placeholder="选择类型，如：属性/事件"
              v-model="scene.trigger.filterType"
              @change="triggerTypeChange"
              :class="{'v-error': !scene.trigger.filterType}"
            >
              <a-select-option value="online">上线</a-select-option>
              <a-select-option value="offline">离线</a-select-option>
              <a-select-option value="properties" v-if="metaData.properties">属性</a-select-option>
              <a-select-option value="event" v-if="metaData.events">事件</a-select-option>
            </a-select>
          </a-col>
        </a-col>
        <template v-if="scene.trigger.filterType === 'properties' || scene.trigger.filterType === 'event'">
          <a-col
            class="properties-col"
            :span="24"
            style="margin-top: 5px;"
            v-for="(item, index) in scene.trigger.filters"
            :key="index">
            <a-col :span="6" v-if="index != 0">
              <a-select
                placeholder="逻辑符"
                v-model="item.logic"
                :class="{'v-error': !item.logic}"
              >
                <a-select-option value="and">AND(并且)</a-select-option>
                <a-select-option value="or">OR(或)</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select
                placeholder="过滤条件KEY"
                v-model="item.key"
                @change="filterKeyChange($event, item)"
                :class="{'v-error': !item.key}"
              >
                <a-select-option v-for="d in dataSource" :value="d.id" :key="d.id">{{ `${d.id}(${d.name})` }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="4" v-if="item.valueType.type && item.valueType.type !== 'this'">
              <a-select
                placeholder="操作符"
                v-model="item.operator"
                :class="{'v-error': !item.operator}"
              >
                <a-select-option value="eq">等于(=)</a-select-option>
                <a-select-option value="neq">不等于(!=)</a-select-option>
                <template v-if="isNumberType(item)">
                  <a-select-option value="gt">大于(>)</a-select-option>
                  <a-select-option value="lt">小于(&lt;)</a-select-option>
                  <a-select-option value="gte">大于等于(>=)</a-select-option>
                  <a-select-option value="lte">小于等于(&lt;=)</a-select-option>
                </template>
                <!-- <a-select-option value="like">模糊(%)</a-select-option> -->
              </a-select>
            </a-col>
            <a-col
              :span="4"
              v-if="item.valueType.type && item.valueType.type !== 'this'"
              :class="{'v-error': item.value === '' || $_.isNil(item.value)}">
              <a-select
                v-if="item.valueType.type === 'bool' && !$_.isNil(item.valueType.trueValue) && !$_.isNil(item.valueType.falseValue)"
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
              <a-select
                v-if="item.valueType.type === 'enum'"
                placeholder="过滤条件值"
                v-model="item.value"
              >
                <a-select-option v-for="elem in item.valueType.elements" :key="elem.value+''">
                  {{ `${elem.text}（${elem.value}）` }}
                </a-select-option>
              </a-select>
              <a-input-number
                v-else-if="['float', 'double'].indexOf(item.valueType.type) !== -1"
                v-model="item.value"
                placeholder="过滤条件值"
              />
              <a-input-number
                v-else-if="['int', 'long'].indexOf(item.valueType.type) !== -1"
                v-model="item.value"
                :precision="0"
                :step="1"
                placeholder="过滤条件值"
              />
              <a-input
                v-else
                placeholder="过滤条件值"
                v-model="item.value"
              />
            </a-col>
            <a-col :span="3">
              <a-popconfirm
                title="确认删除？"
                @confirm="removeFilter(index)"
              >
                <a>删除</a>
              </a-popconfirm>
            </a-col>
          </a-col>
        </template>
        <a-col :span="24" v-if="scene.trigger.filterType === 'properties' || scene.trigger.filterType === 'event'">
          <div>
            <a @click="addFilter">添加</a>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <DeviceSelect @select="doSelectDevice" :productId="scene.productId" ref="DeviceSelect"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { getDetail, getProductList } from '@/views/iot/device/api.js'
import { get as getProduct } from '@/views/iot/product/api.js'
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
  inject: ['formChecker'],
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
    const scene = this.scene
    const trigger = scene.trigger
    this.shakeLimit = trigger.shakeLimit
    const productId = scene.productId
    if (_.isNil(scene.deviceIds)) {
      scene.deviceIds = []
    }
    if (_.isNil(trigger.filters)) {
      trigger.filters = []
    }
    _.forEach(trigger.filters, f => {
      f.valueType = {}
    })
    this.dataSource = []
    if (productId) {
      this.getProduct(productId).then(() => {
        this.setDataSourceValue(trigger.filterType)
        // 回显触发器filter
        _.forEach(trigger.filters, f => {
          const data = _.find(this.dataSource, d => d.id === f.key)
          f.valueType = (data && (data.valueType || {})) || {}
        })
      })
    }
    this.listAllProduct()
    const checkerId = this.checkerId = 'trigger' + _.uniqueId()
    this.formChecker.set(checkerId, () => {
      const scene = this.scene
      if (!scene.productId) {
        this.$message.error('请选择产品')
        return false
      }
      if (scene.trigger.filterType === 'properties' || scene.trigger.filterType === 'event') {
        if (_.isEmpty(scene.trigger.filters)) {
          this.$message.error('请添加触发条件')
          return false
        }
        const list = _.filter(scene.trigger.filters, (item, index) => {
          if (item.valueType.type !== 'this') {
            return (index > 0 && !item.logic) || !item.key || !item.operator || (item.value === '' || _.isNil(item.value))
          } else {
            return (index > 0 && !item.logic)
          }
        })
        if (list.length > 0 || !scene.trigger.filterType) {
          return false
        }
      } else {
        scene.trigger.filters = []
      }
      return true
    })
  },
  beforeDestroy () {
    this.formChecker.delete(this.checkerId)
  },
  methods: {
    triggerTypeChange (value) {
      this.scene.trigger.filters = []
      this.setDataSourceValue(value)
      const f = newFilter()
      f.valueType = {}
      this.scene.trigger.filters = [f]
    },
    removeFilter (index) {
      this.scene.trigger.filters.splice(index, 1)
    },
    addFilter () {
      const f = newFilter()
      f.valueType = {}
      this.scene.trigger.filters.push(f)
    },
    isNumberType (item) {
      return ['float', 'double', 'int', 'long'].indexOf(item.valueType.type) !== -1
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
    setDataSourceValue (type) {
      this.dataSource = []
      const dataSource = this.dataSource
      if (type === 'properties' || type === 'event' || type === 'function') {
        let list = this.metaData.properties
        if (type === 'event') {
          list = this.metaData.events
        } else if (type === 'function') {
          list = this.metaData.functions
        }
        _.forEach(list, data => {
          if (type === 'event') {
            dataSource.push({ id: `${data.id}`, name: data.name, valueType: { type: 'this' } })
            if (data.type === 'object') {
              data.properties.map((p) => {
                dataSource.push({ id: `${data.id}.${p.id}`, name: p.name, valueType: p })
              })
            }
          } else if (type === 'function') {
            dataSource.push({ id: `${data.id}`, name: data.name, valueType: { type: 'this' } })
            if (data.output.type === 'object') {
              data.output.properties.map((p) => {
                dataSource.push({ id: `${data.id}.${p.id}`, name: p.name, valueType: p })
              })
            } else {
              dataSource.push({ id: data.output.id, name: '返回值', valueType: data.output })
            }
          } else if (type === 'properties') {
            if (data.type === 'object') {
              data.properties.map((p) => {
                dataSource.push({ id: `${data.id}.${p.id}`, name: p.name, valueType: p })
              })
            } else {
              dataSource.push({ id: data.id, name: data.name, valueType: data })
            }
          }
        })
      }
    },
    listAllProduct () {
      return getProductList().then((resp) => {
        if (resp.success) {
          this.productList = resp.result
        }
      })
    },
    productIdChange () {
      this.getProduct(this.scene.productId)
      this.scene.deviceIds = []
    },
    getProduct (productId) {
      return getProduct(productId).then(resp => {
        if (resp.success) {
          const result = resp.result
          if (result.metadata) {
            result.metadata = JSON.parse(result.metadata)
          } else {
            result.metadata = {
              properties: [],
              functions: [],
              events: []
            }
          }
          this.metaData = result.metadata
        }
      })
    },
    selectDevice () {
      this.$refs.DeviceSelect.open()
    },
    doSelectDevice (item) {
      const deviceId = item.id
      getDetail(deviceId).then((data) => {
        if (data.success && !_.find(this.scene.deviceIds, id => id === deviceId)) {
          this.scene.deviceIds.push(data.result.id)
        }
      })
    },
    removeDevice (deviceId) {
      this.scene.deviceIds = _.filter(this.scene.deviceIds, id => id !== deviceId)
    }
  }
}
</script>
<style lang="less" scoped>
.device-box {
  border: 1px solid #d9d9d9;
  height: 90px;
  overflow: auto;
  padding: 5px;
  margin: 8px 0px;
}
.properties-col {
  display: flex;
  align-items: center;
}
.ant-input-number {
  width: 100%;
}
</style>
