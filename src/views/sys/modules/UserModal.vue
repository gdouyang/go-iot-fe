<template>
  <div>
    <a-modal
      :title="title"
      :width="500"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="spinning > 0">
        <a-form class="permission-form" :form="form">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="账号"
          >
            <a-input
              v-decorator="['username', { rules: [{ required: true, message: '请输入' }] }]"
              :max-length="32"
            />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="名称"
          >
            <a-input
              placeholder="名称"
              v-decorator="['nickname', { rules: [{ required: true, message: '请输入' }] }]"
              :max-length="32"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态"
          >
            <a-select
              v-decorator="['enableFlag', { rules: [{ required: true, message: '请输入' }] }]">
              <a-select-option :value="true">
                启动
              </a-select-option>
              <a-select-option :value="false">
                禁用
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="密码"
            v-if="!isEdit"
          >
            <a-input
              v-decorator="['password', { rules: [{ required: true, message: '请输入' }, { min: 6, message: '密码不小于6位' }] }]"
              type="password"
              :max-length="20"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="确认密码"
            v-if="!isEdit"
          >
            <a-input
              v-decorator="['password2', { rules: [{ required: true, message: '请输入' }, { validator: validatePassCheck, trigger: 'blur' }] }]"
              type="password"
              :max-length="20"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="角色"
          >
            <a-select
              v-decorator="['roleId', { rules: [{ required: true, message: '请输入' }] }]">
              <a-select-option v-for="item in roleList" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="描述"
          >
            <a-textarea
              :rows="5"
              placeholder="..."
              id="desc"
              v-decorator="['desc']"
              :max-length="200"
            />
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
// import _ from 'lodash'

export default {
  name: 'UserModal',
  props: {
    showTanent: {
      type: Boolean,
      default: false
    }
  },
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
      visible: false,
      confirmLoading: false,
      mdl: {},
      title: '',
      spinning: 0,

      form: this.$form.createForm(this),
      isEdit: false,
      roleList: []
    }
  },
  created () {
  },
  methods: {
    validatePassCheck (rule, value, callback) {
      const form = this.form
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== form.getFieldValue('password')) {
        callback(new Error('两次密码不一致!'))
      } else {
        callback()
      }
    },
    add () {
      this.title = '新增'
      this.mdl = {}
      this.isEdit = false
      this.visible = true
      this.getAllRole()
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },
    edit (record) {
      this.isEdit = true
      this.spinning++
      this.$http.get(`user/${record.id}`)
      .then(data1 => {
        if (data1.success) {
          const data = data1.result
          this.mdl = Object.assign({}, data)
          this.title = '修改'
          this.visible = true
          this.getAllRole()
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.mdl, 'username', 'nickname', 'enableFlag', 'desc', 'roleId'))
          })
        }
      }).finally(() => {
        this.spinning--
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('form values', values)
          values.id = this.mdl.id
          values.isTenant = this.showTanent
          this.confirmLoading = true
          let promise = null
          if (this.isEdit) {
            promise = this.$http.put('user', values)
          } else {
            promise = this.$http.post('user', values)
          }
          promise.then(data => {
            if (data.success) {
              this.$message.success('操作成功')
              _this.close()
              this.$emit('ok')
            } else {
              this.$message.success(data.message)
            }
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.close()
    },
    getAllRole () {
      this.$http.post('role/page', { pageNum: 1, pageSize: 10, condition: {} })
      .then(resp => {
        this.roleList = resp.result.list
      })
    }

  }
}
</script>

<style scoped>

</style>
