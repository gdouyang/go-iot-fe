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
      </a-form-model>
    </Dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { newMqttAddObj } from './entity.js'
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
      addObj: newMqttAddObj(),
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
      this.getNetwork(productId, newMqttAddObj())
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
      this.addObj = newMqttAddObj()
      this.$refs.addFormRef.clearValidate()
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
