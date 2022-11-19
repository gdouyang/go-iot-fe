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
          prop="configuration.useTLS"
        >
          <a-radio-group v-model="addObj.configuration.useTLS">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="addObj.configuration.useTLS"
          label="密钥库"
          prop="keystoreBase64"
          :rules="[
            { required: true, message: '密钥库不能为空', trigger: 'blur' }
          ]">
          <CertificateUpload v-model="addObj.keystoreBase64" />
          <a-input
            type="textarea"
            v-model="addObj.keystoreBase64"
            show-word-limit></a-input>
        </a-form-model-item>
        <a-form-model-item
          v-if="addObj.configuration.useTLS"
          label="信任库"
          prop="trustKeyStoreBase64"
          :rules="[
            { required: true, message: '信任库不能为空', trigger: 'blur' }
          ]">
          <CertificateUpload v-model="addObj.trustKeyStoreBase64" />
          <a-input
            type="textarea"
            v-model="addObj.trustKeyStoreBase64"
            show-word-limit></a-input>
        </a-form-model-item>
      </a-form-model>
    </Dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { defaultMqttAddObj } from './entity.js'
import Base from './Base.vue'

export default {
  name: 'MqttConfigAdd',
  props: {
  },
  mixins: [ Base ],
  components: {
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
      isEdit: false
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
      this.getNetwork(productId, defaultMqttAddObj)
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
      this.addObj = _.cloneDeep(defaultMqttAddObj)
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
