<style lang="less">
</style>

<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose">
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
          <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="服务商"
        prop="provider"
        :rules="[
          { required: true, message: '请选择服务商' }
        ]"
      >
        <a-select v-model="addObj.provider" @change="providerChange">
          <a-select-option v-for="item in providerInfos" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <template v-if="metadata && metadata.properties">
        <a-form-model-item
          v-for="item in metadata.properties"
          :key="item.property"
          :label="item.name"
        >
          <template v-if="['int','string','number','password'].indexOf(item.type.type) !== -1">
            <a-input-password
              v-if=" item.type.type === 'password'"
              v-model="addObj.configuration[item.property]"/>
            <a-input
              v-else
              v-model="addObj.configuration[item.property]"></a-input>
          </template>
          <template v-else-if="item.property === 'properties'">
            <a-card>
              <template v-for="(i, index) in otherConfig">
                <a-row :key="i.id" style="margin-bottom: 5px;">
                  <a-col :span="6">
                    <a-input
                      v-model="i.name"
                      placeholder="key"
                    />
                  </a-col>
                  <a-col :span="2">
                    <a-icon type="double-right" />
                  </a-col>
                  <a-col :span="6">
                    <a-input
                      v-model="i.value"
                      placeholder="value"
                    />
                  </a-col>
                  <a-col :span="2">
                    <a-icon type="double-right" />
                  </a-col>
                  <a-col :span="6">
                    <a-input
                      v-model="i.description"
                      placeholder="说明"
                    />
                  </a-col>
                  <a-col :span="2">
                    <a-icon
                      v-if="index === 0"
                      type="plus"
                      @click="add1"
                    />
                    <a-icon
                      v-else
                      type="minus"
                      @click="minus1(index)"
                    />
                  </a-col>
                </a-row>
              </template>
            </a-card>
          </template>
          <p v-else>缺少</p>
        </a-form-model-item>
      </template>
    </a-form-model>
  </Dialog>
</template>

<script>
import _ from 'lodash'
import { configTypes } from '@/views/notice/config/service.js'

const defaultAddObj = {
  id: null,
  name: '',
  configuration: {
    properties: []
  }
}
export default {
  name: 'ConfigAdd',
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
      providerInfos: [],
      metadata: {},
      otherConfig: [] // { id: null, name: '', value: '', description: '' }
    }
  },
  created () {},
  methods: {
    add () {
      this.isEdit = false
      this.configType()
      this.otherConfig = [
        {
          id: new Date().getTime() + _.uniqueId(),
          name: '',
          value: '',
          description: ''
        }
      ]
      this.$refs.addModal.open({ title: '新增通知配置' })
    },
    edit (row) {
      this.isEdit = true
      this.configType().then(() => {
        this.$http.get(`/notifier/config/${row.id}`)
          .then((data) => {
            if (data.success) {
              const result = data.result
              this.addObj = result
              this.otherConfig = result.configuration.properties
              this.typeChange(result.type)
              this.providerChange(result.provider)
              this.$refs.addModal.open({ title: '编辑通知配置' })
            }
          })
      })
    },
    typeChange (value) {
      const find = _.find(this.typeList, p => p.id === value)
      if (find) {
        this.providerInfos = find.providerInfos
      }
    },
    providerChange (provider) {
      const type = this.addObj.type
      this.$http.get(`/notifier/config/${type}/${provider}/metadata`)
      .then(resp => {
        this.metadata = resp.result
      })
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const data = _.cloneDeep(this.addObj)
          if (data.type === 'email') {
            data.configuration.properties = this.otherConfig
          }
          data.template = JSON.stringify(data.template)
          this.$http.patch('/notifier/config', data)
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
    },
    add1 () {
      this.otherConfig.push({
        id: new Date().getTime() + _.uniqueId(),
        name: '',
        value: '',
        description: ''
      })
    },
    minus1 (index) {
      this.otherConfig.splice(index, 1)
    }
  }
}
</script>
