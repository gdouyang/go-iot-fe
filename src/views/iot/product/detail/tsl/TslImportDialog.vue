<style lang="less">
</style>

<template>
  <div>
    <Dialog
      ref="addModal"
      @confirm="addConfirm"
      @close="addClose"
      :width="550"
      :showOk="showOk"
      cancelText="关闭"
    >
      <a-alert
        style="margin-bottom: 5px;"
        message="导入的物模型会覆盖原来的属性、功能、事件，请谨慎操作！"
        type="warning"
        show-icon
        v-if="showOk">
      </a-alert>
      <AceEditor
        ref="AceEditor"
        v-model="tsl"
        lang="json"
        theme="chrome"
        width="500"
        height="450"
        :options="aceOptions"
      />
    </Dialog>
  </div>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import 'brace/mode/json'
import 'brace/theme/chrome'
import _ from 'lodash'

export default {
  name: 'TslImportDialog',
  components: {
    AceEditor
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      tsl: null,
      aceOptions: {
        enableBasicAutocompletion: true, // 启用基本自动完成功能
        enableLiveAutocompletion: true, // 启用实时自动完成功能 （比如：智能代码提示）
        enableSnippets: true, // 启用代码段
        showLineNumbers: true,
        tabSize: 2,
        wrapEnabled: true,
        showPrintMargin: true,
        readOnly: true
      },
      showOk: false
    }
  },
  created () {
  },
  methods: {
    open (tsl, isImport) {
      if (isImport) {
        this.showOk = true
        this.$refs.addModal.open({ title: '导入物模型' })
        this.tsl = ''
        this.$nextTick(() => {
          const editor = this.$refs.AceEditor.editor
          editor.setOptions({
            readOnly: false
          })
        })
      } else {
        this.showOk = false
        this.$refs.addModal.open({ title: '查看物模型' })
        this.tsl = tsl ? JSON.stringify(tsl, null, 2) : ''
        this.$nextTick(() => {
          const editor = this.$refs.AceEditor.editor
          editor.setOptions({
            readOnly: true
          })
        })
      }
    },
    addConfirm () {
      this.$message.destroy()
      if (!this.tsl) {
        this.$message.error('请填写物模型')
        return
      }
      try {
        const tsl = JSON.parse(this.tsl)
        const text = JSON.stringify(tsl)
        if (!_.isObject(tsl) || !_.startsWith(text, '{') || !_.endsWith(text, '}')) {
          this.$message.error('物模型格式错误，请以“{”开始，以“}”结束')
          return
        }
        this.$emit('import', tsl)
        this.$refs.addModal.close()
      } catch (error) {
        this.$message.error('物模型格式错误，请保证为json字符串')
      }
    },
    addClose () {
    }
  }
}
</script>
