<style lang="less">
</style>

<template>
  <div>
    <Dialog ref="addModal" @confirm="addConfirm" @close="addClose">
      <a-form-model
        ref="addFormRef"
        :model="addObj"
        style="width: 90%"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          label="产品ID"
          prop="id"
          :rules="[
            {required: true, message: '请输入产品ID'},
            {max: 32, message: '产品ID不超过32个字符'},
            {pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '产品ID只能由数字、字母、下划线、中划线组成'}
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
            { required: true, message: '名称不能为空' }
          ]"
        >
          <a-input v-model="addObj.name" placeholder="名称" :maxLength="32"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="网络类型"
          prop="networkType"
          :rules="[
            { required: true, message: '网络类型不能为空' }
          ]"
        >
          <a-select
            placeholder="请选择"
            v-model="addObj.networkType"
            :disabled="isEdit"
          >
            <a-select-option value="MQTT_BROKER">MQTT_BROKER</a-select-option>
            <a-select-option value="TCP_SERVER">TCP_SERVER</a-select-option>
            <a-select-option value="HTTP_SERVER">HTTP_SERVER</a-select-option>
            <a-select-option value="WEBSOCKET_SERVER">WEBSOCKET_SERVER</a-select-option>
            <a-select-option value="MQTT_CLIENT">MQTT_CLIENT</a-select-option>
            <a-select-option value="TCP_CLIENT">TCP_CLIENT</a-select-option>
            <a-select-option value="MODBUS">MODBUS_TCP</a-select-option>
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

  </div>
</template>

<script>
import _ from 'lodash'
import { get, addProduct, updateProduct } from '@/views/iot/product/api.js'
const defaultAddObj = {
  id: null,
  name: '',
  metadata: { events: [], properties: [], functions: [], tags: [] },
  desc: '',
  networkType: ''
}
export default {
  name: 'ProductAdd',
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
  methods: {
    add () {
      this.isEdit = false
      this.$refs.addModal.open({ title: '新增产品' })
    },
    edit (row) {
      this.isEdit = true
      get(row.id).then((data) => {
          if (data.success) {
            const result = data.result
            this.addObj.id = result.id
            this.addObj.name = result.name
            this.addObj.desc = result.desc
            this.addObj.networkType = result.networkType
            this.$refs.addModal.open({ title: '修改产品' })
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
          let promise = null
          const saveData = _.cloneDeep(this.addObj)
          if (this.isEdit) {
            delete saveData.metadata
            promise = updateProduct(saveData.id, saveData)
          } else {
            saveData.state = false
            saveData.metadata = JSON.stringify(this.addObj.metadata)
            promise = addProduct(saveData)
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
