<template>
  <div>
    <div class="editor" :class="{'full-screen': fullScreen}">
      <div class="toolbars">
        <div>
          <a href="javascript:void(0)" @click="save">保存</a>
        </div>
        <div>
          <a href="javascript:void(0)" @click="showDebug">日志</a>
          <a href="javascript:void(0)" @click="showDemo">查看样例</a>
          <a href="javascript:void(0)" @click="switchFullScreen">{{ fullScreen ? '退出全屏' : '全屏' }}</a>
        </div>
      </div>
      <div class="ace-div">
        <AceEditor
          ref="AceEditor"
          v-model="script"
          lang="javascript"
          theme="tomorrow_night"
          :options="aceOptions"
        />
      </div>
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
    <a-drawer
      title="运行日志"
      placement="right"
      width="1000"
      :maskClosable="false"
      @close="debugClose"
      :visible="openDebugDrawer"
      v-if="openDebugDrawer"
    >
      <div class="product-debug" :class="{'isConnect': isConnect}">
        <div :key="index" v-for="(item, index) in debugDataList">
          <span class="time">{{ item.createTime }} </span>
          产品:
          <span class="time">{{ item.productId }} </span>
          设备:
          <span class="time">{{ item.deviceId }} </span>
          <span>{{ item.data }}</span>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getNetwork, updateScript, getEventBusUrl } from '@/views/iot/product/api.js'
import AceEditor from 'vue2-ace-editor'
// 语法提示工具
import 'brace/ext/language_tools' // language extension prerequsite...
import 'brace/ext/searchbox' // language extension prerequsite...
import 'brace/mode/javascript'
import 'brace/theme/tomorrow_night'
import 'brace/snippets/javascript'

// import _ from 'lodash'
import { addCompletions, getCompletions } from './codec/CodeCompletions.js'

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
      network: {},
      openDrawer: false,
      fullScreen: false,
      openDebugDrawer: false,
      debugDataList: [],
      isConnect: false
    }
  },
  created () {
    this.open()
  },
  beforeDestroy () {
    if (this.editor) {
      this.editor.destroy()
    }
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
          this.codeTip = getCompletions(this.network.type)
          this.$nextTick(() => {
            const editor = this.$refs.AceEditor.editor
            this.init(editor)
          })
        }
      })
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
    switchFullScreen () {
      this.fullScreen = !this.fullScreen
      setTimeout(() => {
        this.editor.resize(true)
      })
    },
    init (editor) {
      // 保存快捷键
      const that = this
      editor.commands.addCommand({
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: function (arg) {
            that.save()
          }
      })
      addCompletions(editor, this.codeTip)
      this.editor = editor
    },
    change () {
      setTimeout(() => {
        this.$emit('editor-change', this.codeContent_)
      }, 10)
    },
    showDebug () {
      this.openDebugDrawer = true
      this.connectWs()
    },
    debugClose () {
      this.openDebugDrawer = false
      if (this.ws) {
        this.ws.close()
        this.debugDataList = []
      }
    },
    connectWs () {
      var ws = this.ws = new WebSocket(getEventBusUrl(this.id, '*', 'debug'))
      ws.onopen = (evt) => {
        console.log('debug Connection open ...')
        this.isConnect = true
        this.debugDataList = []
        this.debugDataList.push({ createTime: new Date(), productId: this.id, data: '已连接' })
      }

      ws.onmessage = (evt) => {
        console.log('debug Received Message: ' + evt.data)
        var data = JSON.parse(evt.data)
        this.debugDataList.push(data)
      }

      ws.onclose = (evt) => {
        console.log('debug Connection closed.')
        this.isConnect = false
        this.debugDataList.push({ createTime: new Date(), productId: this.id, data: '连接关闭' })
        this.ws = null
      }
    }
  }
}
</script>
<style lang="less" scoped>
.editor {
  height: 450px;
  width: 1000px;
  .ace-div {
    height: calc(450px - 21px);
  }
  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    width: 100%;
    overflow: auto;
    .ace-div {
      height: calc(100% - 21px);
    }
  }
}
.toolbars {
  background: #eee;
  display: flex;
  justify-content: space-between;
  a {
    margin: 0 5px;
  }
}
.product-debug {
  background-color: black;
  color: white;
  height: calc(100vh - 114px);
  width: 100%;
  overflow: auto;
  border-top: 4px solid red;
  &.isConnect {
    border-top: 4px solid #52c41a;
  }
  .time {
    color: #52c41a;
  }
}
</style>
