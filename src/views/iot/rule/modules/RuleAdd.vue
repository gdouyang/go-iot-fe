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
      <a-form-model :model="scene" :labelCol="{span: 5}" :wrapperCol="{span: 12}" ref="addAlarmForm">
        <a-row>
          <a-col :span="24">
            <a-col :span="12">
              <a-form-model-item
                label="规则名称"
                prop="name"
                :rules="[
                  { required: true, message: '规则名称不能为空' },
                  { max: 50, message: '不能超过50个字符' }
                ]"
              >
                <a-input
                  v-model="scene.name"
                  placeholder="输入规则名称"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="类型"
                prop="type"
                :rules="[
                  { required: true, message: '选择类型' }
                ]"
              >
                <a-select
                  v-model="scene.type"
                >
                  <a-select-option value="scene">场景联动</a-select-option>
                  <a-select-option value="alarm">设备告警</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="触发器类型"
              prop="triggerType"
              :rules="[
                { required: true, message: '选择触发器类型' }
              ]"
            >
              <a-select
                placeholder="选择触发器类型"
                v-model="scene.triggerType"
                @change="sceneTypeChange"
              >
                <a-select-option value="device">设备触发</a-select-option>
                <a-select-option value="timer">定时触发</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="scene.triggerType === 'timer'">
            <a-form-model-item
              label="cron表达式"
              prop="cron"
              :rules="[
                { required: true, message: 'cron表达式不能为空' },
                { max: 50, message: '不能超过50个字符' }
              ]"
            >
              <a-input
                placeholder="cron表达式"
                v-model="scene.cron"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 触发条件 -->
        <a-card style="margin-bottom: 10px;" :bordered="false" size="small" v-if="scene.triggerType === 'device'">
          <Trigger :data="scene"/>
        </a-card>
        <!-- 执行动作 -->
        <a-card :bordered="false" size="small">
          <p style="font-size: 16px;">执行动作</p>
          <Action
            v-for="(item, index) in actions"
            :key="index + '-action'"
            :action="item"
            :position="index"
            @save="saveAction"
            @remove="removeAction"/>
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
import { addScene, updateScene } from '../api.js'
import { newScene } from './triggers/data.js'
import { newEmtpyAction } from '@/views/iot/rule/modules/actions/data.js'
import Trigger from './triggers/TriggerIndex.vue'
import Action from './actions/index.vue'
import _ from 'lodash'
// import moment from 'moment'

export default {
  name: 'SceneAdd',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  provide () {
    return {
      formChecker: this.formChecker
    }
  },
  components: {
    Trigger,
    Action
  },
  computed: {
    title () {
      return this.data && this.data.id ? '编辑规则' : '新建规则'
    }
  },
  created () {
    this.scene = _.cloneDeep(this.data)
    this.init()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.addModal.open()
    })
  },
  data () {
    return {
      scene: {},
      actions: [],
      formChecker: new Map()
    }
  },
  methods: {
    init () {
      const data = this.scene
      if (data && data.id) {
        const actions = _.map(data.actions, a => {
          const deepa = _.cloneDeep(a)
          deepa.configuration = JSON.parse(deepa.configuration)
          return deepa
        })
        this.actions = _.isEmpty(actions) ? [ newEmtpyAction() ] : actions
      } else {
        this.scene = newScene()
        this.actions = [ newEmtpyAction() ]
      }
    },
    sceneTypeChange () {
      if (this.scene.triggerType === 'timer') {
        const s = newScene()
        s.name = this.scene.name
        s.triggerType = this.scene.triggerType
        this.scene = s
      } else {
        this.scene.cron = null
      }
    },
    removeAction (position) {
      this.actions.splice(position, 1)
    },
    addAction () {
      this.actions.push(newEmtpyAction())
    },
    saveAction (index, actionData) {
      this.actions.splice(index, 1, actionData)
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
      const data = _.cloneDeep(this.scene)
      if (data.triggerType === 'device') {
        data.trigger.filters = _.map(data.trigger.filters, f => {
          return {
            key: f.key,
            value: _.toString(f.value),
            operator: f.operator,
            logic: f.logic,
            dataType: f.valueType.type
          }
        })
      }
      data.actions = _.map(this.actions, a => {
        const deepa = _.cloneDeep(a)
        deepa.configuration = JSON.stringify(deepa.configuration)
        return deepa
      })
      console.log(data)
      let promise = null
      if (data.id) {
        promise = updateScene(data.id, data)
      } else {
        promise = addScene(data)
      }
      promise.then(resp => {
        if (resp.success) {
          this.$message.success('启动成功')
          this.$emit('success', data)
        }
      })
    },
    addClose () {
      this.$emit('close')
    }
  }
}
</script>
