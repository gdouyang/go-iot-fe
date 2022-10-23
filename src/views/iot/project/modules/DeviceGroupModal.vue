<style lang="less">
</style>

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
        label="项目"
        prop="projectId"
        :rules="[{ required: true, message: '项目不能为空', trigger: 'blur' }]"
      >
        <a-select v-model="addObj.projectId" :disabled="isEdit">
          <a-select-option v-for="p in projectList" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
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
import { listAllProject } from '@/views/iot/project/service.js'
const defaultAddObj = {
  id: null,
  projectId: null,
  name: '',
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
      this.$refs.addModal.open({ title: '新增分组' })
    },
    edit (row) {
      this.isEdit = true
      this.listAllProject()
      this.$http.get(`device-group/${row.id}`)
        .then((data) => {
          if (data.success) {
            const result = data.result
            this.addObj = result
            this.$refs.addModal.open({ title: '编辑分组' })
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
          this.$http.patch('device-group', this.addObj)
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
    }
  }
}
</script>
