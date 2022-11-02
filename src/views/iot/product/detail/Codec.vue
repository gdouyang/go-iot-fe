<template>
  <div>
    <a-alert
      style="margin-bottom: 5px;width: 900px;"
      type="info"
      show-icon>
      <a slot="message" href="javascript:void(0)" @click="showDemo">查看样例</a>
    </a-alert>
    <AceEditor
      ref="AceEditor"
      v-model="tsl"
      lang="javascript"
      theme="chrome"
      width="900"
      height="450"
      :options="aceOptions"
      @init="init"
    />
    <div>
      <a-button type="primary" @click="save">
        保存
      </a-button>
    </div>

    <Dialog
      ref="DemoCodeModal"
      @confirm="addConfirm"
      @close="addClose"
      :width="600"
      :showOk="false"
      cancelText="关闭"
    >
      <AceEditor
        v-model="demoCode"
        lang="javascript"
        theme="chrome"
        width="550"
        height="450"
        :options="demoAceOptions"
      />
    </Dialog>
  </div>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
// 语法提示工具
import 'brace/ext/language_tools' // language extension prerequsite...
import 'brace/ext/searchbox' // language extension prerequsite...
import 'brace/mode/javascript'
import 'brace/theme/chrome'
// import 'brace/snippets/javascript'
// import _ from 'lodash'
import TcpTpl from './codec/tcp-tpl.js'
import MqttTpl from './codec/mqtt-tpl.js'
import WebSocketTpl from './codec/websocket-tpl.js'
import HttpTpl from './codec/http-tpl.js'

export default {
  name: 'Codec1',
  props: {
    id: {
      type: String,
      required: true
    },
    product: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    AceEditor
  },
  data () {
    return {
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
      editor: null,
      demoCode: '',
      demoAceOptions: {
        showLineNumbers: true,
        tabSize: 2,
        wrapEnabled: true,
        showPrintMargin: true,
        readOnly: true
      },
      network: {}
    }
  },
  created () {
    this.open()
    this.codeTip = this.getTpl().codeTip
  },
  methods: {
    open () {
      this.tsl = ''
      this.$http.get(`/product/network/${this.id}`)
      .then(data => {
        if (data.success) {
          this.network = data.result
          this.tsl = this.network.script || this.getTpl().tpl
          this.$nextTick(() => {
            const editor = this.$refs.AceEditor.editor
            editor.setOptions({
              readOnly: false
            })
          })
        }
      })
    },
    getTpl () {
      if (this.network.type === 'TCP_SERVER' || this.data.type === 'TCP_CLIENT') {
        return TcpTpl
      } else if (this.network.type === 'MQTT_BROKER') {
        return MqttTpl
      } else if (this.network.type === 'WEBSOCKET_SERVER') {
        return WebSocketTpl
      } else if (this.network.type === 'HTTP_SERVER') {
        return HttpTpl
      } else {
        return { tpl: '' }
      }
    },
    save () {
      this.$message.destroy()
      if (!this.tsl) {
        this.$message.error('请填写物模型')
      }
      this.$http.put(`/product/network`, { productId: this.id, script: this.tsl })
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
        }
      })
    },
    showDemo () {
      this.demoCode = this.getTpl().demoCode
      this.$refs.DemoCodeModal.open({ title: '样例' })
    },
    init (editor) {
      // editor.on('change', this.change)
      // editor.commands.addCommand({
      //   name: 'save',
      //   bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      //   exec: editor => this.$emit('save-change', this.value, editor)
      // })
      // editor.commands.addCommand({
      //   name: 'formatter',
      //   bindKey: { win: 'Ctrl-Shift-F', mac: 'Command-Shift-F' },
      //   exec: () => this.$emit('formatter', this.editor)
      // })
      // 加入自定义语法提示
      const that = this
      editor.completers = [{
        getCompletions: function (editor, session, pos, prefix, callback) {
          that.setCompletions(editor, session, pos, prefix, callback)
        }
      }]
      this.editor = editor
    },
    setCompletions (editor, session, pos, prefix, callback) {
      const data = this.codeTip
      console.log(prefix)
      if (prefix.length === 0) {
        return callback(null, [])
      } else {
        return callback(null, data)
      }
    },
    change () {
      setTimeout(() => {
        this.$emit('editor-change', this.codeContent_)
      }, 10)
    }
  }
}
</script>
<style lang="less">
</style>
