<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="spinning > 0">
        <a-form-model class="permission-form" :model="form" ref="form">
          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="新密码"
            prop="password"
            :rules="[{ required: true, message: '请输入新密码', whitespace: true }, { min: 6, message: '密码不小于6位' }]"
          >
            <a-input
              v-model.trim="form.password"
              type="password"
              :max-length="20"
            />
          </a-form-model-item>

          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="确认密码"
            prop="password2"
            :rules="[{ required: true, message: '请输入', whitespace: true }, { validator: validatePassCheck, trigger: 'blur' }]"
          >
            <a-input
              v-model.trim="form.password2"
              type="password"
              :max-length="20"
            />
          </a-form-model-item>

          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="旧密码"
            prop="passwordOld"
            :rules="[{ required: true, message: '请输入旧密码', whitespace: true }]"
          >
            <a-input
              v-model.trim="form.passwordOld"
              type="password"
              :max-length="20"
            />
          </a-form-model-item>

        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'PwdModal',
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
      title: '',
      spinning: 0,

      form: {
        password: '',
        password2: '',
        passwordOld: ''
      }
    }
  },
  created () {
  },
  methods: {
    validatePassCheck (rule, value, callback) {
      const form = this.form
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== form.password) {
        callback(new Error('两次密码不一致!'))
      } else {
        callback()
      }
    },
    open () {
      this.title = '修改密码'
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const url = 'user-info/update-pwd'
      const _this = this
      // 触发表单验证
      this.$refs.form.validate((valid) => {
        // 验证表单没错误
        if (valid) {
          const values = this.form
          console.log('form values', values)
          this.confirmLoading = true
          this.$http.put(url, values)
          .then(data => {
            if (data.success) {
              this.$success({
                content: '密码修改成功，请重新登录',
                keyboard: false,
                onOk: () => {
                  store.dispatch('Logout').then(() => {
                    setTimeout(() => {
                      window.location.reload()
                    }, 500)
                  })
                }
              })
            } else {
              this.$message.info(data.message)
            }
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
