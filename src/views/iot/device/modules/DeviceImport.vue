<style lang="less">
</style>

<template>
  <Dialog
    ref="addModal"
    @confirm="addConfirm"
    @close="addClose"
    :width="500"
    title="批量导入设备"
    :okBtnLoading="okBtnLoading"
  >
    <a-form-model
      ref="addFormRef"
      :model="addObj"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-model-item
        label="产品"
        prop="productId"
        :rules="[{ required: true, message: '请选择产品', trigger: 'blur' }]"
      >
        <a-select v-model="addObj.productId" placeholder="产品" @change="productIdChange">
          <a-select-option v-for="p in productList" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-show="addObj.productId"
        label="文件"
        prop="fileName"
        :rules="[{ required: true, message: '请选择文件', trigger: 'blur' }]"
      >
        <a-upload
          name="file"
          accept=".xlsx"
          :multiple="false"
          :showUploadList="false"
          :withCredentials="true"
          @change="uploadChange"
          :before-upload="beforeUpload"
        >
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
        <span>{{ addObj.fileName }}</span>
      </a-form-model-item>
      <div v-if="addObj.productId">
        <a :href="templateDownloadUrl">下载模版</a>
      </div>
      <div v-if="importLoading">
        <a-badge status="success" text="已完成" v-if="isFinish"/>
        <a-badge status="processing" text="进行中" v-else/>
        <span style="margin-left: 15px;">总数量:{{ count }}</span>
        <p style="color: red;">{{ errMessage }}</p>
      </div>
    </a-form-model>
  </Dialog>
</template>

<script>
import { getTemplateDownloadUrl, getImportResultUrl } from '../api'
import _ from 'lodash'
const defaultAddObj = {
  productId: undefined,
  fileName: undefined
}
export default {
  name: 'DeviceImport',
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
      productList: [],
      importLoading: false,
      okBtnLoading: false,
      isFinish: false,
      count: 0,
      errMessage: null,
      templateDownloadUrl: ''
    }
  },
  created () {},
  methods: {
    open () {
      this.listAllProduct().then(() => {
        this.$refs.addModal.open()
      })
    },
    uploadChange (data) {
      this.addObj.fileName = data.file.name
    },
    beforeUpload (file) {
      this.file = file
      return false
    },
    addClose () {
      this.importLoading = false
      this.okBtnLoading = false
      this.isFinish = false
      this.count = 0
      this.errMessage = null
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.clearValidate()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const formData = new FormData()
          formData.append('file', this.file)
          this.importLoading = true
          this.okBtnLoading = true
          this.$http.post(`device/${this.addObj.productId}/import`, formData)
          .then((resp) => {
            if (resp.success) {
              this.showImportResult(resp.result)
            } else {
              this.$message.success(resp.message)
              this.okBtnLoading = true
            }
          })
        }
      })
    },
    showImportResult (id) {
      var source = new EventSource(getImportResultUrl(id))
      source.onmessage = (e) => {
        const res = JSON.parse(e.data)
        if (res.success) {
          const temp = res.result.num
          this.count = temp
          if (res.result.finish) {
            this.isFinish = true
            this.okBtnLoading = false
            source.close()
            this.$message.success('操作成功')
            this.$refs.addModal.close()
            this.$emit('success')
          }
        } else {
          this.isFinish = true
          this.okBtnLoading = false
          this.errMessage = res.message
        }
      }
      source.onerror = () => {
        // this.isFinish = true
        source.close()
        // this.$message.success('操作成功')
        // this.$refs.addModal.close()
        // this.$emit('success')
      }
      // 添加一个开启回调
      source.onopen = function (event) {
      }
    },
    listAllProduct () {
      return this.$http.get('/product/list')
      .then((resp) => {
        if (resp.success) {
          this.productList = resp.result
        }
      })
    },
    productIdChange () {
      this.templateDownloadUrl = getTemplateDownloadUrl(this.addObj.productId)
    }
  }
}
</script>
