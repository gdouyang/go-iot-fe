<template>
  <div>
    <Dialog ref="addModal" title="TCP配置" @confirm="addConfirm" @close="addClose">
      <a-form-model
        ref="addFormRef"
        :model="addObj"
        style="width: 90%"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          label="开启SSL"
          prop="configuration.useTLS"
        >
          <a-radio-group v-model="addObj.configuration.useTLS">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="addObj.configuration.useTLS"
          label="crt文件"
          prop="certBase64"
          :rules="[
            { required: true, message: 'crt文件不能为空', trigger: 'blur' }
          ]">
          <CertificateUpload v-model="addObj.certBase64" />
          <a-input
            type="textarea"
            v-model="addObj.certBase64"
            show-word-limit></a-input>
        </a-form-model-item>
        <a-form-model-item
          v-if="addObj.configuration.useTLS"
          label="key文件"
          prop="keyBase64"
          :rules="[
            { required: true, message: 'key文件不能为空', trigger: 'blur' }
          ]">
          <CertificateUpload v-model="addObj.keyBase64" />
          <a-input
            type="textarea"
            v-model="addObj.keyBase64"
            show-word-limit></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="解析方式"
          prop="configuration.delimeter.type"
          :rules="[
            { required: true, message: '请选择' }
          ]"
        >
          <a-select v-model="addObj.configuration.delimeter.type" @change="parserTypeChange">
            <a-select-option value="DIRECT">不处理</a-select-option>
            <a-select-option value="Delimited">分隔符</a-select-option>
            <a-select-option value="FixLength">固定长度</a-select-option>
            <a-select-option value="SplitFunc">自定义脚本</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="分隔符"
          prop="configuration.delimeter.delimited"
          v-if="addObj.configuration.delimeter.type === 'Delimited'"
        >
          <a-input v-model="addObj.configuration.delimeter.delimited" :maxLength="128"></a-input>
        </a-form-model-item>
        <!-- 固定长度 -->
        <a-form-model-item
          label="长度值"
          prop="configuration.delimeter.length"
          v-if="addObj.configuration.delimeter.type === 'FixLength'"
        >
          <a-input v-model="addObj.configuration.delimeter.length" :maxLength="128"></a-input>
        </a-form-model-item>
        <!-- 自定义脚本 -->
        <a-form-model-item
          label="解析脚本"
          prop="configuration.delimeter.size"
          v-if="addObj.configuration.delimeter.type === 'SplitFunc'"
        >
          <a href="javascript:void(0)" @click="showDemo">查看样例</a>
          <AceEditor
            ref="AceEditor"
            v-model="addObj.configuration.delimeter.splitFunc"
            lang="javascript"
            theme="chrome"
            width="400"
            height="250"
            :options="aceOptions"
            @init="init"
          />
        </a-form-model-item>
      </a-form-model>
    </Dialog>
    <a-drawer
      title="说明"
      placement="right"
      width="750"
      @close="openDrawer = false"
      :visible="openDrawer"
      v-if="openDrawer"
    >
      <Doc :type="'SplitFunc'"/>
    </a-drawer>
  </div>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import 'brace/mode/javascript'
import 'brace/theme/chrome'
// import moment from 'moment'
import _ from 'lodash'
import { defaultTcpAddObj } from './entity.js'
import Base from './Base.vue'

export default {
  name: 'TcpConfigAdd',
  props: {
  },
  mixins: [ Base ],
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
      addObj: _.cloneDeep(defaultTcpAddObj),
      isEdit: false,
      aceOptions: {
        enableBasicAutocompletion: true, // 启用基本自动完成功能
        enableLiveAutocompletion: true, // 启用实时自动完成功能 （比如：智能代码提示）
        enableSnippets: true, // 启用代码段
        showLineNumbers: true,
        tabSize: 2,
        wrapEnabled: true,
        showPrintMargin: true,
        readOnly: false
      },
      openDrawer: false
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    open (productId) {
      if (!productId) {
        this.$message.error('请指定产品ID')
        return
      }
      this.productId = productId
      this.getNetwork(productId, defaultTcpAddObj)
      .then(data => {
        this.isEdit = false
        if (data.id) {
          this.isEdit = true
        }
        this.addObj = data
        this.$refs.addModal.open()
      })
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultTcpAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const saveData = _.cloneDeep(this.addObj)
          this.updateNetwork(saveData).then((resp) => {
            if (resp.success) {
              this.$message.success('操作成功')
              this.$refs.addModal.close()
              this.$emit('success')
            } else {
              this.$message.error(resp.message)
            }
          })
        }
      })
    },
    parserTypeChange (value) {
      const c = this.addObj.configuration.delimeter
      if (value === 'DIRECT') {
        c.delimited = undefined
        c.length = undefined
        c.splitFunc = undefined
      } else if (value === 'Delimited') {
        c.length = undefined
        c.splitFunc = undefined
      } else if (value === 'FixLength') {
        c.delimited = undefined
        c.splitFunc = undefined
      } else if (value === 'SplitFunc') {
        c.delimited = undefined
        c.length = undefined
        c.splitFunc = `function splitFunc(parser) {

}`
      }
    },
    showDemo () {
      this.openDrawer = true
    },
    init (editor) {
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
      if (prefix.length === 0) {
        return callback(null, [])
      } else {
        return callback(null, [
          { caption: 'parser.AddHandler()', value: 'parser.AddHandler(function(data){\n\n})' },
          { caption: 'parser.AppendResult()', value: 'parser.AppendResult(data)' },
          { caption: 'parser.Complete()', value: 'parser.Complete()' },
          { caption: 'parser.Fixed()', value: 'parser.Fixed(21)' },
          { caption: 'parser.Delimited()', value: 'parser.Delimited("\\n")' }
        ])
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
