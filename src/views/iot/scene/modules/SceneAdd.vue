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
      <a-form-model :model="data" :labelCol="{span: 5}" :wrapperCol="{span: 12}" ref="addAlarmForm">
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              label="场景联动名称"
              prop="name"
              :rules="[
                { required: true, message: '场景联动名称不能为空' },
                { max: 50, message: '不能超过50个字符' }
              ]"
            >
              <a-input
                v-model="data.name"
                placeholder="输入场景联动名称"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 触发条件 -->
        <a-card style="margin-bottom: 10px;" :bordered="false" size="small">
          <p style="font-size: 16px;">触发条件
            <a-tooltip title="触发条件满足条件中任意一个即可触发">
              <a-icon type="question-circle-o"/>
            </a-tooltip>
          </p>
          <div v-for="(item, index) in triggers" :key="index + '-trigger'">
            <Trigger
              :trigger="item"
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
import { newTrigger } from './triggers/data.js'
import { newEmtpyAction } from '@/views/iot/alarm/actions/data.js'
import Trigger from './triggers/triggers-index.vue'
import Action from '@/views/iot/alarm/actions/index.vue'
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
      return this.data && this.data.id ? '编辑场景联动' : '新建场景联动'
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
      triggers: [],
      actions: [],
      formChecker: new Map()
    }
  },
  methods: {
    init () {
      const props = this
      const data = props.data
      if (data) {
        this.triggers = _.isEmpty(data.triggers) ? [ newTrigger() ] : data.triggers
        this.actions = _.isEmpty(data.actions) ? [ newEmtpyAction() ] : data.actions
      } else {
        this.triggers = [ newTrigger() ]
        this.actions = [ newEmtpyAction() ]
      }
    },
    addTrigger () {
      this.triggers.push(newTrigger())
    },
    removeTriggers (position) {
      this.triggers.splice(position, 1)
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
      const props = this
      const data = _.cloneDeep(props.data)
      const triggers = []
      _.forEach(this.triggers, t => {
        t = _.cloneDeep(t)
        _.forEach(t.filters, f => {
          delete f.valueType
        })
        triggers.push(t)
      })
      data.triggers = triggers
      data.actions = this.actions
      console.log(data)
      let promise = null
      if (data.id) {
        promise = updateScene(data)
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
