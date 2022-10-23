<template>
  <div>
    <Dialog ref="addModal" title="MQTT配置" @confirm="addConfirm" @close="addClose">
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
          label="最大消息长度"
          prop="configuration.maxMessageSize"
        >
          <a-input-number v-model="addObj.configuration.maxMessageSize" :min="0"></a-input-number>
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
import { defaultMqttAddObj } from './entity.js'

export default {
  name: 'MqttConfigAdd',
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
      addObj: _.cloneDeep(defaultMqttAddObj),
      isEdit: false,
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
        const defaultValue = _.cloneDeep(defaultMqttAddObj)
        const obj = data.result || defaultValue
        this.addObj = obj
        this.$refs.addModal.open()
      })
      this.getAllCertificate()
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultMqttAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const saveData = _.cloneDeep(this.addObj)
          if (!saveData.configuration.ssl) {
            saveData.configuration.certId = null
          }
          saveData.configuration.productId = this.productId
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
