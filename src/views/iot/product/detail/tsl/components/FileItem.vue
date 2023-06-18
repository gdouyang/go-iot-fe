<template>
  <a-form-model-item label="文件类型">
    <a-select v-model="data.fileType">
      <a-select-option value="url">URL(链接)</a-select-option>
      <a-select-option value="base64">Base64(Base64编码)</a-select-option>
      <!-- <a-select-option value="binary">Binary(二进制)</a-select-option> -->
    </a-select>,
  </a-form-model-item>
</template>

<script>
export default {
  name: 'FileItem',
  components: {
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  created () {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
