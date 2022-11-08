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
          label="证书"
          prop="configuration.certificate"
          v-if="addObj.configuration.useTLS"
        >
          <a-input v-model="addObj.configuration.certificate"></a-input>
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
            <a-select-option value="delimited">分隔符</a-select-option>
            <a-select-option value="fixed_length">固定长度</a-select-option>
            <a-select-option value="script">自定义脚本</a-select-option>
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
          <AceEditor
            ref="AceEditor"
            v-model="addObj.configuration.delimeter.splitFunc"
            lang="javascript"
            theme="chrome"
            width="400"
            height="250"
            :options="aceOptions"
          />
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
      }
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
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
