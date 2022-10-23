<style lang="less">
</style>

<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="1000">
    <a-form-model
      ref="addFormRef"
      :model="addObj"
      :labelCol="{span: 2}"
      :wrapperCol="{span: 22}"
    >
      <a-form-model-item
        label="模版名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入模版名称', trigger: 'blur' }
        ]"
      >
        <a-input v-model="addObj.name" placeholder="名称" :maxLength="32"></a-input>
      </a-form-model-item>
      <a-row>
        <a-col :span="12">
          <a-form-model-item
            label="通知类型"
            prop="type"
            :rules="[
              { required: true, message: '请输入通知类型' }
            ]"
            :labelCol="{span: 4}"
            :wrapperCol="{span: 20}"
          >
            <a-select v-model="addObj.type" @change="typeChange">
              <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="服务商"
            prop="provider"
            :rules="[
              { required: true, message: '请选择服务商' }
            ]"
            :labelCol="{span: 4}"
            :wrapperCol="{span: 20}"
          >
            <a-select v-model="addObj.provider">
              <a-select-option v-for="item in providerInfos" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <template v-if="currentType === 'email'">
        <Email :data="addObj" ref="email"/>
      </template>
    </a-form-model>
  </Dialog>
</template>

<script>
import _ from 'lodash'
import { configTypes } from '@/views/notice/config/service.js'
import Email from './Email.vue'
const defaultAddObj = {
  id: null,
  name: '',
  type: undefined,
  provider: undefined,
  template: {}
}
export default {
  name: 'TemplateAdd',
  components: {
    Email
  },
  data () {
    return {
      addObj: _.cloneDeep(defaultAddObj),
      isEdit: false,
      typeList: [],
      providerInfos: [],
      currentType: undefined
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
        this.$http.get(`/notifier/template/${row.id}`)
          .then((data) => {
            if (data.success) {
              const result = data.result
              this.addObj = result
              this.typeChange(result.type)
              this.$refs.addModal.open({ title: '编辑通知配置' })
            }
          })
      })
    },
    typeChange (value, option) {
      const find = _.find(this.typeList, p => p.id === value)
      if (find) {
        this.currentType = value
        this.providerInfos = find.providerInfos
      }
      if (option) {
        this.addObj.provider = undefined
      }
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.currentType = undefined
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const data = _.cloneDeep(this.addObj)
          if (data.type === 'email') {
            data.template = this.$refs.email.getTemplate()
          }
          this.$http.patch('/notifier/template', data)
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
