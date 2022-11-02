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
            {max: 64, message: '产品ID不超过64个字符'},
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

const defaultAddObj = {
  id: null,
  name: '',
  metadata: { events: [], properties: [], functions: [], tags: [] },
  desc: ''
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
      this.$http.get(`product/${row.id}`)
        .then((data) => {
          if (data.success) {
            const result = data.result
            this.addObj = result
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
          saveData.state = false
          if (this.isEdit) {
            promise = this.$http.put(`product/${saveData.id}`, saveData)
          } else {
            promise = this.$http.post('product', saveData)
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
