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
      v-model="script"
      lang="javascript"
      theme="tomorrow_night"
      width="1000"
      height="450"
      :options="aceOptions"
    />
    <div style="margin-top: 10px;">
      <a-button type="primary" @click="save">
        保存
      </a-button>
    </div>

    <a-drawer
      :title="`脚本说明(${network.type})`"
      placement="right"
      width="750"
      @close="openDrawer = false"
      :visible="openDrawer"
      v-if="openDrawer"
    >
      <Doc :type="network.type"/>
    </a-drawer>
  </div>
</template>

<script>
import { getNetwork, updateScript } from '@/views/iot/product/api.js'
import AceEditor from 'vue2-ace-editor'
// 语法提示工具
import 'brace/ext/language_tools' // language extension prerequsite...
import 'brace/ext/searchbox' // language extension prerequsite...
import 'brace/mode/javascript'
import 'brace/theme/tomorrow_night'
import 'brace/snippets/javascript'

import _ from 'lodash'
import TcpTpl from './codec/TcpTpl.js'
import MqttTpl from './codec/MqttTpl.js'
import WebSocketTpl from './codec/WebsocketTpl.js'
import HttpTpl from './codec/HttpTpl.js'
import Modbus from './codec/Modbus.js'

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
      script: null,
      aceOptions: {
        enableBasicAutocompletion: true, // 启用基本自动完成功能
        enableLiveAutocompletion: true, // 启用实时自动完成功能 （比如：智能代码提示）
        enableSnippets: true, // 启用代码段
        showLineNumbers: true,
        tabSize: 2,
        wrapEnabled: true,
        showPrintMargin: true,
        readOnly: false,
        fontSize: 14
      },
      editor: null,
      network: {},
      openDrawer: false
    }
  },
  created () {
    this.open()
  },
  computed: {
    isClientNet () {
      return this.network.type === 'TCP_CLIENT' || this.network.type === 'MQTT_CLIENT' || this.network.type === 'MODBUS'
    }
  },
  methods: {
    open () {
      this.script = this.product.script
      getNetwork(this.id)
      .then(data => {
        if (data.success) {
          this.network = data.result
          this.codeTip = this.getTpl().codeTip
          this.$nextTick(() => {
            const editor = this.$refs.AceEditor.editor
            this.init(editor)
          })
        }
      })
    },
    getTpl () {
      var net = this.network
      if (net.type === 'TCP_SERVER' || net.type === 'TCP_CLIENT') {
        return TcpTpl
      } else if (net.type === 'MQTT_BROKER' || net.type === 'MQTT_CLIENT') {
        return MqttTpl
      } else if (net.type === 'WEBSOCKET_SERVER') {
        return WebSocketTpl
      } else if (net.type === 'HTTP_SERVER') {
        return HttpTpl
      } else if (net.type === 'MODBUS') {
        return Modbus
      } else {
        return { tpl: '' }
      }
    },
    save () {
      this.$message.destroy()
      if (!this.script) {
        this.$message.error('请填写物模型')
      }
      updateScript(this.id, { script: this.script })
      .then(data => {
        if (data.success) {
          if (this.isClientNet) {
            this.$message.success('操作成功,重新连接后生效')
          } else {
            this.$message.success('操作成功,重启网络服务后生效')
          }
        }
      })
    },
    showDemo () {
      this.openDrawer = true
    },
    init (editor) {
      // 加入自定义语法提示
      const that = this
      editor.completers.push({
        id: 'goiotCodeCompletions',
        identifierRegexps: [/a-zA-Z_./],
        getCompletions: function (editor, session, pos, prefix, callback) {
          that.setCompletions(editor, session, pos, prefix, callback)
        }
      })
      this.editor = editor
    },
    setCompletions (editor, session, pos, prefix, callback) {
      const data = this.codeTip
      console.log(prefix)
      prefix = _.trim(prefix)
      if (!prefix || prefix === '.' || prefix.length === 0) {
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
