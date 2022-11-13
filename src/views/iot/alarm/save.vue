<template>
  <Dialog
    :title="title"
    ref="addModal"
    @confirm="submitData"
    @close="addClose"
    width="70%"
    style="margin-top: -3%;"
  >
    <div :style="{ maxHeight: 750, overflowY: 'auto', overflowX: 'hidden' }">
      <a-form-model :model="data" :labelCol="{span: 2}" :wrapperCol="{span: 8}" ref="addAlarmForm">
        <a-form-model-item
          label="告警名称"
          prop="name"
          :rules="[
            { required: true, message: '告警名称不能为空' },
            { max: 50, message: '不能超过50个字符' }
          ]"
        >
          <a-input
            v-model="data.name"
            placeholder="输入告警名称 "
          />
        </a-form-model-item>
        <!-- 触发条件 -->
        <a-card style="margin-bottom: 10px;" :bordered="false" size="small">
          <p style="font-size: 16px;">触发条件
            <a-tooltip title="触发条件满足条件中任意一个即可触发">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
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
          </p>
          <div v-for="(item, index) in trigger" :key="index + '-trigger'">
            <Triggers
              :trigger="item"
              :metaData="metaData"
              :position="index"
              @remove="removeTriggers"
            />
          </div>
          <a-button
            icon="plus"
            type="link"
            @click="addTrigger"
          >
            新增触发器
          </a-button>
        </a-card>
        <!-- 转换 -->
        <a-card style="margin-bottom: 10px;" :bordered="false" size="small">
          <p style="font-size: 16px;">转换
            <a-tooltip title="将内置的结果字段转换为自定义字段，例如：deviceId 转为 id">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </p>
          <div style="max-height: 200; overflow-y: 'auto'; overflow-x: 'hidden';background-color: '#F5F5F6';padding-top: 10;">
            <a-row
              :gutter="16"
              style="padding-bottom: 10px; margin-left: 13px; margin-right: 3px;"
              v-for="(item, index) in properties"
              :key="index + '-properties'">
              <a-col :span="6">
                <a-input
                  placeholder="请输入属性"
                  v-model="item.property"
                />
              </a-col>
              <a-col :span="6">
                <a-input
                  placeholder="请输入别名"
                  v-model="item.alias"
                />
              </a-col>
              <a-col :span="12" style="text-align: 'right'; margin-top: 6; padding-right: 15;">
                <a style="padding-Top: 7" @click="removeProperties(index)">删除</a>
              </a-col>
            </a-row>
            <a-col :span="24" style="margin-left: 20;">
              <a
                @click="() => {
                  properties = ([...properties, {_id: Math.round(Math.random() * 100000)}])
                }">添加</a>
            </a-col>
          </div>
        </a-card>
        <!-- 执行动作 -->
        <a-card :bordered="false" size="small">
          <p style="font-size: 16px;">执行动作
          </p>
          <template v-for="(item, index) in action">
            <Actions
              :key="index + '-action'"
              :action="item"
              :position="index"
              @save="saveAction"
              @remove="removeAction"/>
          </template>
          <a-button
            icon="plus"
            type="link"
            @click="addAction"
          >
            执行动作
          </a-button>
        </a-card>
      </a-form-model>
    </div>
  </Dialog>
</template>
<script>
import { newTrigger } from './triggers/data.js'
import { newEmtpyAction } from './actions/data.js'
import Triggers from './triggers/triggers-index.vue'
import Actions from './actions/index.vue'
import _ from 'lodash'
// import moment from 'moment'

export default {
  name: 'AlamrSave',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    target: {
      type: String,
      default: ''
    },
    targetId: {
      type: String,
      default: ''
    },
    metaData: {
      type: Object,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    },
    productId: {
      type: String,
      default: ''
    },
    productName: {
      type: String,
      default: ''
    }
  },
  provide () {
    return {
      formChecker: this.formChecker
    }
  },
  components: {
    Triggers,
    Actions
  },
  computed: {
    title () {
      return this.data && this.data.id ? '编辑告警' : '新建告警'
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.addModal.open()
    })
  },
  data () {
    return {
      properties: [],
      trigger: [],
      action: [],
      shakeLimit: {
        enabled: false,
        time: undefined,
        threshold: undefined,
        alarmFirst: true
      },
      formChecker: new Map()
    }
  },
  methods: {
    init () {
      const props = this
      const data = props.data
      if (data.alarmRule) {
        this.shakeLimit = (data.alarmRule.shakeLimit ? data.alarmRule.shakeLimit : {
          enabled: false,
          time: undefined,
          threshold: undefined,
          alarmFirst: true
        })
        this.trigger = _.isEmpty(data.alarmRule.triggers) ? [ newTrigger() ] : data.alarmRule.triggers
        this.action = _.isEmpty(data.alarmRule.actions) ? [ newEmtpyAction() ] : data.alarmRule.actions
        this.properties = _.isEmpty(data.alarmRule.properties) ? [ {} ] : data.alarmRule.properties
      } else {
        this.trigger = [ newTrigger() ]
        this.action = [ newEmtpyAction() ]
        this.properties = [{}]
      }
    },
    addTrigger () {
      this.trigger.push(newTrigger())
    },
    removeTriggers (position) {
      this.trigger.splice(position, 1)
    },
    removeProperties (val) {
      this.properties.splice(val, 1)
    },
    removeAction (position) {
      this.action.splice(position, 1)
    },
    addAction () {
      this.action.push(newEmtpyAction())
    },
    saveAction (index, actionData) {
      this.action.splice(index, 1, actionData)
    },
    submitData () {
      let isPass = true
      this.$refs.addAlarmForm.validate((valid) => {
        isPass = valid
      })
      this.formChecker.forEach((checker, key) => {
        if (!checker()) {
          isPass = false
        }
      })
      if (!isPass) {
        return
      }
      const props = this
      const data = _.cloneDeep(props.data)
      data.name = props.data.name
      data.target = props.target
      data.targetId = props.targetId
      const triggers = []
      _.forEach(this.trigger, t => {
        t = _.cloneDeep(t)
        _.forEach(t.filters, f => {
          delete f.valueType
        })
        triggers.push(t)
      })
      if (props.target === 'device') {
        data.alarmRule = {
          name: props.name,
          deviceId: props.targetId,
          deviceName: props.name,
          triggers: triggers,
          actions: this.action,
          properties: this.properties,
          productId: props.productId,
          productName: props.productName,
          shakeLimit: this.shakeLimit
        }
      } else {
        data.alarmRule = {
          name: props.name,
          productId: props.targetId,
          productName: props.name,
          triggers: triggers,
          actions: this.action,
          properties: this.properties,
          shakeLimit: this.shakeLimit
        }
      }
      this.$emit('save', data)
    },
    addClose () {
      this.$emit('close')
    }
  }
}
</script>
