<template>
  <div>
    <a-col :span="4">
      <a-tooltip title="请选择通知类型">
        <a-select
          placeholder="选择通知类型"
          v-model="actionData.configuration.notifyType"
          :class="{'v-error': notifyTypeError}"
          @change="notifyTypeChange">
          <a-select-option v-for="(item) in notifyTypeConfig" :key="item.type" :value="item.type">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-tooltip>
    </a-col>
    <a-col :span="4">
      <a-tooltip title="请选择通知配置">
        <a-select
          placeholder="选择通知配置"
          v-model="actionData.configuration.notifierId"
          :class="{'v-error': notifierIdError}"
        >
          <a-select-option v-for="(item) in messageConfig" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-tooltip>
    </a-col>
  </div>
</template>

<script>
import _ from 'lodash'
// import encodeQueryParam from '@/utils/encodeParam.js'
import { configTypes, listAll } from '@/views/notice/api.js'
export default {
  name: 'NotifierAction',
  props: {
    actionData: {
      type: Object,
      default: null
    }
  },
  inject: ['formChecker'],
  components: {
  },
  data () {
    return {
      notifyTypeConfig: [],
      messageConfig: [],
      templateConfig: [],
      notifyTypeError: false,
      notifierIdError: false,
      templateIdError: false
    }
  },
  created () {
    this.getAllTypes()
    const checkerId = this.checkerId = 'notifier-action' + _.uniqueId()
    this.formChecker.set(checkerId, () => {
      this.notifyTypeError = this.notifierIdError = false
      if (!this.actionData.configuration.notifyType) {
        this.notifyTypeError = true
      }
      if (!this.actionData.configuration.notifierId) {
        this.notifierIdError = true
      }
      if (this.notifyTypeError || this.notifierIdError) {
        return false
      }
      return true
    })
  },
  beforeDestroy () {
    this.formChecker.delete(this.checkerId)
  },
  methods: {
    getAllTypes () {
      const actionData = this.actionData
      configTypes()
      .then((result) => {
        this.notifyTypeConfig = result
        if (actionData.configuration.notifyType) {
          this.findNotifier(actionData.configuration.notifyType)
        }
      })
    },
    notifyTypeChange (value) {
      this.findNotifier(value)
      this.actionData.configuration.notifyType = value
      this.clearNotifierId()
    },
    clearNotifierId () {
      this.messageConfig = []
      this.actionData.configuration.notifierId = undefined
    },
    findNotifier (value) { // 通知配置
      const param = {
        type: value,
        state: 'started'
      }
      listAll(param).then((response) => {
        if (response.success) {
          this.messageConfig = (response.result)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
