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
          prop="configuration.ssl"
        >
          <a-radio-group v-model="addObj.configuration.ssl">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="证书"
          prop="configuration.certId"
          v-if="addObj.configuration.ssl"
        >
          <a-select v-model="addObj.configuration.certId" :allowClear="true">
            <a-select-option v-for="c in certificateList" :key="c.id" :value="c.id">{{ c.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="解析方式"
          prop="configuration.parserType"
          :rules="[
            { required: true, message: '请选择' }
          ]"
        >
          <a-select v-model="addObj.configuration.parserType" @change="parserTypeChange">
            <a-select-option value="DIRECT">不处理</a-select-option>
            <a-select-option value="delimited">分隔符</a-select-option>
            <a-select-option value="fixed_length">固定长度</a-select-option>
            <a-select-option value="script">自定义脚本</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="分隔符"
          prop="configuration.parserConfiguration.delimited"
          v-if="addObj.configuration.parserType === 'delimited'"
        >
          <a-input v-model="addObj.configuration.parserConfiguration.delimited" :maxLength="128"></a-input>
        </a-form-model-item>
        <!-- 固定长度 -->
        <a-form-model-item
          label="长度值"
          prop="configuration.parserConfiguration.size"
          v-if="addObj.configuration.parserType === 'fixed_length'"
        >
          <a-input v-model="addObj.configuration.parserConfiguration.size" :maxLength="128"></a-input>
        </a-form-model-item>
        <!-- 自定义脚本 -->
        <a-form-model-item
          label="解析脚本"
          prop="configuration.parserConfiguration.size"
          v-if="addObj.configuration.parserType === 'script'"
        >
          <AceEditor
            ref="AceEditor"
            v-model="addObj.configuration.parserConfiguration.script"
            lang="javascript"
            theme="chrome"
            width="400"
            height="250"
            :options="aceOptions"
          />
        </a-form-model-item>
        <a-form-model-item label="说明" prop="description">
          <a-input
            type="textarea"
            v-model="addObj.description"
            placeholder="说明"
            :maxLength="200"
            show-word-limit></a-input>
        </a-form-model-item>
      </a-form-model>
    </Dialog>
  </div>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import 'brace/mode/javascript'
import 'brace/theme/chrome'
// import moment from 'moment'
import _ from 'lodash'
import { defaultTcpAddObj } from './entity.js'

export default {
  name: 'TcpConfigAdd',
  props: {
  },
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
      certificateList: []
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
      this.$http.get(`network/config/${productId}`)
      .then(data => {
        this.isEdit = false
        if (data.result) {
          this.isEdit = true
        }
        const defaultValue = _.cloneDeep(defaultTcpAddObj)
        const obj = data.result || defaultValue
        if (!obj.configuration.parserConfiguration) {
          obj.configuration.parserConfiguration = defaultValue.configuration.parserConfiguration
        }
        this.addObj = obj
        this.$refs.addModal.open()
      })
      this.getAllCertificate()
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultTcpAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const saveData = _.cloneDeep(this.addObj)
          if (!saveData.configuration.ssl) {
            saveData.configuration.certId = null
          }
          saveData.configuration.parserConfiguration.productId = this.productId
          this.$http.patch(`network/config/${this.productId}`, saveData).then((resp) => {
            if (resp.success) {
              this.$message.success('操作成功')
              this.$refs.addModal.close()
              this.$emit('success')
            } else {
              this.$message.success(resp.message)
            }
          })
        }
      })
    },
    getAllCertificate () {
      this.$http.post('network/certificate/_query', {})
      .then(data => {
        this.certificateList = data.result || []
      })
    },
    parserTypeChange (value) {
      const c = this.addObj.configuration.parserConfiguration
      if (value === 'DIRECT') {
        c.delimited = undefined
        c.size = undefined
        c.lang = undefined
        c.script = undefined
      } else if (value === 'delimited') {
        c.size = undefined
        c.lang = undefined
        c.script = undefined
      } else if (value === 'fixed_length') {
        c.delimited = undefined
        c.lang = undefined
        c.script = undefined
      } else if (value === 'script') {
        c.delimited = undefined
        c.size = undefined
        c.lang = 'javascript'
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
