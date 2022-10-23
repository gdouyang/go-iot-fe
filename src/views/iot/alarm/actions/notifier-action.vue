<template>
  <div>
    <a-col :span="4">
      <a-tooltip title="请选择通知类型">
        <a-select
          placeholder="选择通知类型"
          v-model="actionData.configuration.notifyType"
          :class="{'v-error': notifyTypeError}"
          @change="notifyTypeChange">
          <a-select-option v-for="(item) in notifyTypeConfig" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-tooltip>
    </a-col>
    <a-col :span="6">
      <a-tooltip title="请选择通知配置">
        <a-select
          placeholder="选择通知配置"
          v-model="actionData.configuration.notifierId"
          :class="{'v-error': notifierIdError}"
          @change="notifierIdChange"
        >
          <a-select-option v-for="(item) in messageConfig" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-tooltip>
    </a-col>
    <a-col :span="6">
      <a-tooltip title="请选择通知模板">
        <a-select
          placeholder="选择通知模板"
          v-model="actionData.configuration.templateId"
          :class="{'v-error': templateIdError}"
        >
          <a-select-option v-for="(item) in templateConfig" :key="item.id" :value="item.id">
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
import { configTypes } from '@/views/notice/config/service.js'
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
      this.notifyTypeError = this.notifierIdError = this.templateIdError = false
      if (!this.actionData.configuration.notifyType) {
        this.notifyTypeError = true
      }
      if (!this.actionData.configuration.notifierId) {
        this.notifierIdError = true
      }
      if (!this.actionData.configuration.templateId) {
        this.templateIdError = true
      }
      if (this.notifyTypeError || this.notifierIdError || this.templateIdError) {
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
      this.clearTemplate()
    },
    clearNotifierId () {
      this.messageConfig = []
      this.actionData.configuration.notifierId = undefined
    },
    clearTemplate () {
      this.actionData.configuration.templateId = undefined
      this.templateConfig = []
    },
    notifierIdChange (value) {
      const find = _.find(this.messageConfig, p => p.id === value)
      if (find) {
        this.findTemplate(find)
      }
      this.clearTemplate()
    },
    findNotifier (value) { // 通知配置
      const actionData = this.actionData
      const param = {
        type: value
      }
      this.$http.post(`/notifier/config/_query`, param)
      .then((response) => {
        if (response.success) {
          this.messageConfig = (response.result.list)
          response.result.list.map((item) => {
            if (item.id === actionData.configuration.notifierId) {
              this.findTemplate(item)
            }
          })
        }
      })
    },
    findTemplate (value) { // 通知模板
      const param = {
        type: value.type,
        provider: value.provider
      }
      this.$http.post(`/notifier/template/_query`, param).then(res => {
        if (res.success && res.result) {
          this.templateConfig = (res.result.list)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.v-error {
  /deep/ .ant-select-selection {
    border-color: red;
  }
}
</style>
