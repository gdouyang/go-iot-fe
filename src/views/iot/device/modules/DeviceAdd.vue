<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="500">
    <a-form-model
      ref="addFormRef"
      :model="addObj"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-model-item
        label="设备ID"
        prop="id"
        :rules="[
          { required: true, message: '设备ID不能为空', trigger: 'blur' }
        ]"
      >
        <a-input
          v-model="addObj.id"
          :maxLength="32"
          :disabled="isEdit"
        ></a-input>
      </a-form-model-item>
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
        label="产品"
        prop="productId"
        :rules="[{ required: true, message: '产品不能为空', trigger: 'blur' }]"
      >
        <a-select v-model="addObj.productId" @change="productIdChange" :disabled="isEdit" placeholder="产品">
          <a-select-option v-for="p in productList" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="说明" prop="desc">
        <a-input
          type="textarea"
          v-model="addObj.desc"
          placeholder="说明"
          :maxLength="200"
          show-word-limit></a-input>
      </a-form-model-item>
    </a-form-model>
  </Dialog>
</template>

<script>
import _ from 'lodash'
import { get, getProductList, addDevice, updateDevice } from '@/views/iot/device/api.js'
const defaultAddObj = {
  id: null,
  name: '',
  productId: undefined,
  productName: undefined,
  projectId: undefined,
  deviceGroupId: undefined,
  desc: ''
}
export default {
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
      isEdit: false,
      productList: [],
      projectList: [],
      groupList: []
    }
  },
  created () {},
  methods: {
    add () {
      this.isEdit = false
      this.listAllProduct().then(() => {
        this.$refs.addModal.open({ title: '新增设备' })
      })
    },
    edit (row) {
      this.isEdit = true
      get(row.id).then((data) => {
        if (data.success) {
          const result = data.result
          this.projectIdChange(result.projectId)
          this.listAllProduct().then(() => {
            this.addObj = result
            this.$refs.addModal.open({ title: '修改设备' })
          })
        }
      })
    },
    projectIdChange (value) {
      if (value) {
        this.listByProject(value)
      }
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          let promise = null
          if (this.isEdit) {
            promise = updateDevice(this.addObj)
          } else {
            promise = addDevice(this.addObj)
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
    },
    productIdChange (value) {
      const product = _.find(this.productList, p => p.id === value)
      if (product) {
        this.addObj.productName = product.name
      }
    },
    listAllProduct () {
      return getProductList().then((resp) => {
        if (resp.success) {
          this.productList = resp.result
        }
      })
    }
  }
}
</script>
<style lang="less">
</style>
