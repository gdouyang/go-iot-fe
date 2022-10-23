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

const defaultAddObj = {
  id: null,
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
      isEdit: false
    }
  },
  created () {},
  methods: {
    add () {
      this.isEdit = false
      this.$refs.addModal.open({ title: '新增分组' })
    },
    edit (row) {
      this.isEdit = true
      this.$http.get(`project/${row.id}`)
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
          this.$http.patch('project', this.addObj)
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
    }
  }
}
</script>
