<style lang="less">
</style>

<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="1000">
    <a-form-model
      ref="addFormRef"
      :model="addObj"
      style="width: 90%"
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
        label="通知类型"
        prop="type"
        :rules="[
          { required: true, message: '请输入通知类型' }
        ]"
      >
        <a-select v-model="addObj.type" @change="typeChange">
          <a-select-option v-for="item in typeList" :key="item.type" :value="item.type">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <template v-if="metadata">
        <a-form-model-item
          v-for="item in metadata"
          :key="item.name"
          :label="item.title"
        >
          <template v-if="['int','string','number','password'].indexOf(item.type) !== -1">
            <a-input-password
              v-if=" item.type === 'password'"
              v-model="addObj.config[item.name]"/>
            <a-input
              v-else
              :placeholder="item.desc"
              v-model="addObj.config[item.name]"></a-input>
          </template>
        </a-form-model-item>
      </template>
      <template v-if="addObj.type === 'email'">
        <Email :data="addObj" ref="email"/>
      </template>
    </a-form-model>
  </Dialog>
</template>

<script>
import _ from 'lodash'
import { get, addNotify, updateNotify, configTypes } from '@/views/notice/api.js'
import Email from './Email.vue'

const defaultAddObj = {
  id: null,
  name: '',
  type: null,
  config: {},
  template: null
}
export default {
  name: 'ConfigAdd',
  components: {
    Email
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
      isEdit: false,
      typeList: [],
      metadata: []
    }
  },
  created () {},
  methods: {
    add () {
      this.isEdit = false
      this.configType()
      this.$refs.addModal.open({ title: '新增通知配置' })
    },
    edit (row) {
      this.isEdit = true
      this.configType().then(() => {
        get(row.id).then((data) => {
            if (data.success) {
              const result = data.result
              result.config = JSON.parse(result.config)
              this.addObj = result
              this.typeChange(result.type)
              this.$refs.addModal.open({ title: '编辑通知配置' })
            }
          })
      })
    },
    typeChange (value) {
      const find = _.find(this.typeList, p => p.type === value)
      if (find) {
        this.metadata = find.config
      }
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.metadata = []
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const data = _.cloneDeep(this.addObj)
          if (data.type === 'email') {
            data.template = this.$refs.email.getTemplate()
          }
          data.config = JSON.stringify(data.config)
          let promise = null
          if (data.id) {
            promise = updateNotify(data)
          } else {
            promise = addNotify(data)
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
    configType () {
      return configTypes()
      .then(result => {
        this.typeList = result
      })
    }
  }
}
</script>
