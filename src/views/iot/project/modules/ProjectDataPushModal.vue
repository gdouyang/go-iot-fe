<style lang="less">
</style>

<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="500">
    <a-alert message="推送为post请求, context-type为json" type="info" show-icon />
    <a-form-model
      ref="addFormRef"
      :model="addObj"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-model-item
        label="分组"
        prop="projectId"
        :rules="[{ required: true, message: '分组不能为空', trigger: 'blur' }]"
      >
        <a-select v-model="addObj.projectId" placeholder="分组">
          <a-select-option v-for="p in projectList" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="地址"
        prop="url"
        :rules="[
          { required: true, message: '地址不能为空', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ]"
      >
        <a-input v-model="addObj.url" placeholder="地址" :maxLength="256"></a-input>
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
import { listAllProject } from '@/views/iot/project/service.js'
const defaultAddObj = {
  id: null,
  projectId: null,
  url: null,
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
      projectList: []
    }
  },
  created () {},
  methods: {
    add () {
      this.isEdit = false
      this.listAllProject()
      this.$refs.addModal.open({ title: '新增推送配置' })
    },
    edit (row) {
      this.isEdit = true
      this.listAllProject()
      this.$http.get(`project-datapush/${row.id}`)
        .then((data) => {
          if (data.success) {
            const result = data.result
            this.addObj = result
            this.$refs.addModal.open({ title: '编辑推送配置' })
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
          this.$http.patch('project-datapush', this.addObj)
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
    listAllProject () {
      return listAllProject()
      .then((list) => {
        this.projectList = list
      })
    },
    validateUrl (rule, value, callback) {
      if (!_.startsWith(value, 'http://') && !_.startsWith(value, 'https://')) {
        callback(new Error('地址需要以http://或https://开头'))
      } else {
        callback()
      }
    }
  }
}
</script>
