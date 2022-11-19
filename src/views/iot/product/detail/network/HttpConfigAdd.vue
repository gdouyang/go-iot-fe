<template>
  <div>
    <Dialog ref="addModal" title="Http配置" @confirm="addConfirm" @close="addClose">
      <a-form-model
        ref="addFormRef"
        :model="addObj"
        style="width: 90%"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          label="开启SSL"
          prop="configuration.useTLS"
        >
          <a-radio-group v-model="addObj.configuration.useTLS">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="addObj.configuration.useTLS"
          label="crt文件"
          prop="certBase64"
          :rules="[
            { required: true, message: 'crt文件不能为空', trigger: 'blur' }
          ]">
          <CertificateUpload v-model="addObj.certBase64" />
          <a-input
            type="textarea"
            v-model="addObj.certBase64"
            show-word-limit></a-input>
        </a-form-model-item>
        <a-form-model-item
          v-if="addObj.configuration.useTLS"
          label="key文件"
          prop="keyBase64"
          :rules="[
            { required: true, message: 'key文件不能为空', trigger: 'blur' }
          ]">
          <CertificateUpload v-model="addObj.keyBase64" />
          <a-input
            type="textarea"
            v-model="addObj.keyBase64"
            show-word-limit></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="协议路由"
        >
          <a-card>
            <a-row v-for="(i, index) in addObj.configuration.routers" :key="index" style="margin-bottom: 5px;">
              <a-col span="15">
                <a-input v-model="i.url" placeholder="/**"></a-input>
              </a-col>
              <a-col span="8" style="text-align:center;">
                <a-button :size="'small'" @click="minusRouter(index)" :disabled="index === 0" class="btn"> - </a-button>
                <a-divider type="vertical" />
                <a-button :size="'small'" @click="plusRouter" class="btn">+</a-button>
              </a-col>
            </a-row>
          </a-card>
        </a-form-model-item>
      </a-form-model>
    </Dialog>
  </div>
</template>

<script>
// import moment from 'moment'
import _ from 'lodash'
import { defaultHttpAddObj } from './entity.js'
import Base from './Base.vue'

export default {
  name: 'WebSocketConfigAdd',
  props: {
  },
  mixins: [ Base ],
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
      addObj: _.cloneDeep(defaultHttpAddObj),
      isEdit: false
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    open (productId) {
      if (!productId) {
        this.$message.error('请指定产品ID')
        return
      }
      this.productId = productId
      this.getNetwork(productId, defaultHttpAddObj)
      .then(data => {
        this.isEdit = false
        if (data.id) {
          this.isEdit = true
        }
        this.addObj = data
        this.$refs.addModal.open()
      })
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultHttpAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const saveData = _.cloneDeep(this.addObj)
          let urlDup = false
          _.forEach(saveData.configuration.routers, r => {
            const find = _.find(saveData.configuration.routers, p => p.id !== r.id && p.url === r.url)
            if (find) {
              urlDup = true
            }
          })
          if (urlDup) {
            this.$message.error('路由重复，请修改')
            return
          }
          this.updateNetwork(saveData).then((resp) => {
            if (resp.success) {
              this.$message.success('操作成功')
              this.$refs.addModal.close()
              this.$emit('success')
            } else {
              this.$message.error(resp.message)
            }
          })
        }
      })
    },
    minusRouter (index) {
      this.addObj.configuration.routers.splice(index, 1)
    },
    plusRouter () {
      this.addObj.configuration.routers.push({
        id: new Date().getTime(),
        url: '',
        protocol: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  height: 32px;
  width: 32px;
}
</style>
