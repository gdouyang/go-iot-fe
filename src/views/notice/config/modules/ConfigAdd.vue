<style lang="less">
</style>

<template>
  <Dialog ref="addModal" @close="dialogClose" :width="1000">
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
          :prop="'config.' + item.name"
          :rules="[
            { required: item.required === 'true', message: '请输入' + item.name }
          ]"
        >
          <a-input-password
            v-if=" item.type === 'password'"
            v-model="addObj.config[item.name]"/>
          <a-input
            v-else
            :placeholder="item.desc"
            v-model="addObj.config[item.name]"></a-input>
        </a-form-model-item>
      </template>
      <template v-if="addObj.type === 'email'">
        <Email :data="addObj" ref="email"/>
      </template>
      <template v-if="addObj.type === 'dingtalk'">
        <Dingtalk :data="addObj" ref="dingtalk"/>
      </template>
    </a-form-model>
    <span slot="footer">
      <a-button @click="close">取消</a-button>
      <a-button type="primary" @click="addConfirm">确定</a-button>
      <a-button icon="experiment" :loading="isTesting" @click="test">测试</a-button>
    </span>
  </Dialog>
</template>

<script>
import _ from 'lodash'
import { get, addNotify, updateNotify, configTypes, testNotify } from '@/views/notice/api.js'
import Email from './Email.vue'
import Dingtalk from './Dingtalk.vue'

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
    Email,
    Dingtalk
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
      metadata: [],
      isTesting: false
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
    close () {
      this.$refs.addModal.close()
    },
    dialogClose () {
      this.$refs.addFormRef.clearValidate()
      this.addObj = _.cloneDeep(defaultAddObj)
      this.metadata = []
    },
    getData () {
      const data = _.cloneDeep(this.addObj)
      if (data.type === 'email') {
        data.template = this.$refs.email.getTemplate()
      }
      if (data.type === 'dingtalk') {
        data.template = this.$refs.dingtalk.getTemplate()
      }
      data.config = JSON.stringify(data.config)
      return data
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const data = this.getData()
          let promise = null
          if (data.id) {
            promise = updateNotify(data.id, data)
          } else {
            promise = addNotify(data)
          }
          promise.then((resp) => {
            if (resp.success) {
              this.$message.success('操作成功')
              this.close()
              this.$emit('success')
            } else {
              this.$message.success(resp.message)
            }
          })
        }
      })
    },
    test () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const data = this.getData()
          this.isTesting = true
          testNotify(data).then(resp => {
            if (resp.success) {
               this.$message.success('操作成功')
            }
          }).finally(() => {
            this.isTesting = false
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
