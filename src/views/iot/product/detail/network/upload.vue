<template>
  <a-upload
    name="file"
    :multiple="false"
    action="api/file/base64"
    @change="handleChange"
    :showUploadList="false"
    :withCredentials="true"
  >
    <a-button> <a-icon type="upload" /> 上传文件 </a-button>
  </a-upload>
</template>

<script>
  export default {
    name: 'CertificateUpload',
    props: {
      value: {
        type: String,
        default: null
      }
    },
    data () {
      return {
      }
    },
    methods: {
      handleChange (info) {
        if (info.file.status === 'uploading') {
        }
        if (info.file.status === 'done') {
          this.$emit('input', info.file.response.result)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
