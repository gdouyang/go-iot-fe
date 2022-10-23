<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="500">
    <a-form-model
      ref="addFormRef"
      :model="addObj"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-model-item
        label="名称"
        prop="name"
        :rules="[
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]"
      >
        <a-input v-model="addObj.name" placeholder="名称" :maxLength="32"></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="类型"
        prop="instance"
        :rules="[{ required: true, message: '类型不能为空', trigger: 'blur' }]"
      >
        <a-select v-model="addObj.instance">
          <a-select-option value="PFX">PFX</a-select-option>
          <a-select-option value="JKS">JKS</a-select-option>
          <a-select-option value="PEM">PEM</a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 密钥库 -->
      <a-form-model-item
        label="密钥库"
        prop="configs.keystoreBase64"
        :rules="[
          { required: true, message: '密钥库不能为空', trigger: 'blur' }
        ]">
        <CertificateUpload v-model="addObj.configs.keystoreBase64" />
        <a-input
          type="textarea"
          v-model="addObj.configs.keystoreBase64"
          show-word-limit></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="密钥库密码"
        prop="configs.keystorePwd"
        v-if="addObj.instance != 'PEM'"
      >
        <a-input v-model="addObj.configs.keystorePwd" :maxLength="256"></a-input>
      </a-form-model-item>
      <!-- 信任库 -->
      <a-form-model-item
        label="信任库"
        prop="configs.trustKeyStoreBase64"
        :rules="[
          { required: true, message: '信任库不能为空', trigger: 'blur' }
        ]">
        <CertificateUpload v-model="addObj.configs.trustKeyStoreBase64" />
        <a-input
          type="textarea"
          v-model="addObj.configs.trustKeyStoreBase64"
          show-word-limit></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="信任库密码"
        prop="configs.trustKeyStorePwd"
        v-if="addObj.instance != 'PEM'"
      >
        <a-input v-model="addObj.configs.trustKeyStorePwd" :maxLength="256"></a-input>
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
</template>

<script>
import _ from 'lodash'
import CertificateUpload from './upload.vue'
const defaultAddObj = {
  id: null,
  name: '',
  description: '',
  configs: {
    keystoreBase64: '',
    trustKeyStoreBase64: '',
    keystorePwd: '',
    trustKeyStorePwd: ''
  }
}
export default {
  components: {
    CertificateUpload
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
      addObj: _.cloneDeep(defaultAddObj),
      isEdit: false
    }
  },
  created () {},
  methods: {
    add () {
      this.isEdit = false
      this.$refs.addModal.open({ title: '新增证书' })
    },
    edit (row) {
      this.isEdit = true
      this.$http
        .request({
          url: `network/certificate/${row.id}`,
          method: 'get'
        })
        .then((data) => {
          if (data.success) {
            const result = data.result
            this.addObj = result
            this.$refs.addModal.open({ title: '修改证书' })
          }
        })
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.$http.patch('network/certificate', this.addObj)
            .then((resp) => {
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
    }
  }
}
</script>
<style lang="less">
</style>
