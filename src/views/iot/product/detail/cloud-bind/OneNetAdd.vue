<template>
  <div>
    <Dialog ref="addModal" title="OneNet配置" @confirm="addConfirm" @close="addClose">
      <a-form-model
        ref="addFormRef"
        :model="addObj"
        style="width: 90%"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          label="接口地址"
          prop="apiAddress"
          :rules="[
            {required: true, message: '请输入接口地址'}
          ]"
        >
          <a-input
            v-model="addObj.apiAddress"
            :maxLength="512"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="apiKey"
          prop="apiKey"
          :rules="[
            { required: true, message: '请输入apiKey' }
          ]"
        >
          <a-input v-model="addObj.apiKey" :maxLength="128"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="通知Token"
          prop="validateToken"
          :rules="[
            { required: true, message: '请输入通知Token' }
          ]"
        >
          <a-input v-model="addObj.validateToken" :maxLength="128"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="aesKey"
          prop="name"
        >
          <a-input v-model="addObj.aesKey" :maxLength="128"></a-input>
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
// import moment from 'moment'
import _ from 'lodash'
const defaultAddObj = {
  id: null,
  name: '',
  apiAddress: null,
  apiKey: null,
  validateToken: null,
  aesKey: null,
  description: null
}
export default {
  name: 'OneNetAdd',
  props: {
  },
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
      addObj: _.cloneDeep(defaultAddObj),
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
      this.$http.get(`one-net/${productId}`)
      .then(data => {
        this.isEdit = false
        if (data.result) {
          this.isEdit = true
        }
        this.addObj = data.result || _.cloneDeep(defaultAddObj)
        this.addObj.id = this.addObj.name = productId
        this.$refs.addModal.open()
      })
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          let promise = null
          const saveData = _.cloneDeep(this.addObj)
          if (this.isEdit) {
            promise = this.$http.post('one-net', saveData)
          } else {
            promise = this.$http.put(`one-net`, saveData)
          }
          promise.then((resp) => {
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

<style lang="less" scoped>
</style>
