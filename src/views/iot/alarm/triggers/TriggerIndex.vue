<template>
  <div>
    <a-card size="small" :bordered="false" style="background-color: #eee;">
      <a-row>
        <span>触发器: {{ position + 1 }}</span>
        <a-popconfirm
          title="确认删除此触发器？"
          @confirm="$emit('remove', position)"
        >
          <a>删除</a>
        </a-popconfirm>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-col :span="4">
            <a-select
              placeholder="选择触发器类型"
              v-model="trigger.trigger"
            >
              <a-select-option value="device">设备触发</a-select-option>
              <!-- <a-select-option value="timer">定时触发</a-select-option> -->
            </a-select>
          </a-col>
          <a-col :span="4" v-if="trigger.trigger === 'timer'">
            <a-input
              placeholder="cron表达式"
              v-model="trigger.cron"
            />
          </a-col>
        </a-col>
        <template v-if="trigger.trigger">
          <a-col :span="24" style="margin-top: 5px;">
            <a-col :span="4">
              <a-select
                placeholder="选择类型，如：属性/事件"
                v-model="trigger.type"
                @change="triggerTypeChange"
              >
                <a-select-option value="online">上线</a-select-option>
                <a-select-option value="offline">离线</a-select-option>
                <a-select-option value="properties" v-if="metaData.properties">属性</a-select-option>
                <a-select-option value="event" v-if="metaData.events">事件</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="4" v-if="trigger.type === 'properties'">
              <a-select
                placeholder="物模型属性"
                v-model="trigger.modelId"
                @change="modelIdPropertiesChange"
              >
                <a-select-option v-for="item in metaData.properties" :key="item.id" :value="item.id">
                  {{ `${item.name}（${item.id}）` }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="4" v-else-if="trigger.type === 'event'">
              <a-select
                placeholder="物模型事件"
                v-model="trigger.modelId"
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
            v-for="(item, index) in trigger.filters"
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
        </template>
        <a-col :span="24">
          <div>
            <a @click="addFilter">添加</a>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { newFilter } from './data'
export default {
  name: 'AlarmTrigger',
  props: {
    trigger: {
      type: Object,
      default: null
    },
    position: {
      type: Number,
      default: null
    },
    metaData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
  },
  created () {
    if (this.metaData) {
      const metadata = this.metaData
      const trigger = this.trigger
      let data = null
      if (trigger.type === 'event') {
        data = metadata['events']
      } else if (trigger.type === 'function') {
        data = metadata['functions']
      } else {
        data = metadata[trigger.type]
      }
      if (data) {
        this.dataSource = []
        // const dataSource = this.dataSource
        // dataSource.push(trigger.modelId)
        data.map((item) => {
          if (item.id === trigger.modelId) {
            this.setDataSourceValue(trigger.type, item, trigger.modelId)
          }
        })
      }
    }
    if (_.isNil(this.trigger.filters)) {
      this.trigger.filters = []
    } else {
      // 回显触发器filter
      _.forEach(this.trigger.filters, f => {
        const data = _.find(this.dataSource, d => d.id === f.key)
        f.valueType = (data && (data.valueType || {})) || {}
      })
    }
  },
  data () {
    return {
      dataSource: []
    }
  },
  methods: {
    triggerTypeChange (value) {
      this.trigger.filters = []
    },
    modelIdPropertiesChange (value) {
      const data = _.find(this.metaData.properties, p => p.id === value)
      if (data) {
        this.setDataSourceValue('properties', data, value)
      }
      const f = newFilter()
      f.valueType = {}
      this.trigger.filters = [f]
    },
    modelIdEventChange (value) {
      const data = _.find(this.metaData.events, p => p.id === value)
      if (data) {
        this.setDataSourceValue('event', data, value)
      }
      const f = newFilter()
      f.valueType = {}
      this.trigger.filters = [f]
    },
    removeFilter (index) {
      this.trigger.filters.splice(index, 1)
    },
    addFilter () {
      const f = newFilter()
      f.valueType = {}
      this.trigger.filters.push(f)
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
    }
  }
}
</script>
