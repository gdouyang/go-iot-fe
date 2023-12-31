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
          { required: true, message: '设备ID不能为空', trigger: 'blur' },
          { max: 32, message: '设备ID不超过32个字符' },
          { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '设备ID只能由数字、字母、下划线、中划线组成' }
        ]"
      >
        <a-input
          v-model="addObj.id"
          :disabled="isEdit"
          placeholder="请输入设备ID"
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
      <a-form-model-item
        label="设备类型"
        prop="deviceType"
        :rules="[{ required: true, message: '设备类型不能为空', trigger: 'blur' }]"
      >
        <a-select v-model="addObj.deviceType" :disabled="isEdit" @change="deviceTypeChange">
          <a-select-option value="device">设备</a-select-option>
          <a-select-option value="gateway">网关</a-select-option>
          <a-select-option value="subdevice">子设备</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="网关"
        prop="parentId"
        v-if="addObj.deviceType == SUB_DEVICE"
        :rules="[{ required: true, message: '网关不能为空', trigger: 'blur' }]"
      >
        <a-select v-model="addObj.parentId" :disabled="isEdit">
          <a-select-option v-for="p in gatewayList" :key="p.id" :value="p.id">{{ p.name }}({{ p.id }})</a-select-option>
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
import { page, get, getProductList, addDevice, updateDevice } from '@/views/iot/device/api.js'
const defaultAddObj = {
  id: null,
  name: '',
  productId: null,
  productName: null,
  deviceType: 'device',
  parentId: null,
  desc: ''
}
/**
 * 子设备
 */
const SUB_DEVICE = 'subdevice'
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
      SUB_DEVICE: SUB_DEVICE,
      productList: [],
      gatewayList: []
    }
  },
  created () {
  },
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
          if (result.deviceType === SUB_DEVICE) {
            this.getGatewayList(result.parentId)
          }
          this.listAllProduct().then(() => {
            this.addObj = result
            this.$refs.addModal.open({ title: '修改设备' })
          })
        }
      })
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.clearValidate()
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
      this.deviceTypeChange(this.addObj.deviceType)
    },
    deviceTypeChange (value) {
      this.addObj.parentId = null
      if (value === SUB_DEVICE) {
        this.getGatewayList()
      }
    },
    listAllProduct () {
      return getProductList().then((resp) => {
        if (resp.success) {
          this.productList = resp.result
        }
      })
    },
    getGatewayList (deviceId) {
      const condition = [{ key: 'deviceType', value: 'gateway' }, { key: 'productId', value: this.addObj.productId }]
      if (deviceId) {
        condition.push({ key: 'id', value: deviceId })
      }
      return page({ pageNum: 1, pageSize: 1000, condition: condition }).then(res => {
        this.gatewayList = res.result.list
      })
    }
  }
}
</script>
<style lang="less">
</style>
