<style lang="less">
</style>

<template>
  <div>
    <a-form-model-item
      label="标题"
      prop="template.title"
      :rules="[
        { required: true, message: '请输入标题' },
        { max: 255, message: '长度不超过255' }
      ]">
      <a-input v-model="data.template.title"/>
    </a-form-model-item>
    <a-form-model-item
      label="正文"
      prop="template.text"
      :rules="[
        { required: true, message: '请输入正文' },
        { max: 5120, message: '长度不超过5120' }
      ]"
    >
      <Markdown v-model="data.template.text" :toolbars="toolbars"/>
    </a-form-model-item>
  </div>
</template>

<script>
import _ from 'lodash'
import Markdown from 'vue-meditor'
export default {
  name: 'Dingtalk',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  components: {
    Markdown
  },
  data () {
    return {
      template: {},
      toolbars: { uploadImage: false, theme: false, exportmd: false, importmd: false }
    }
  },
  created () {
    let str = this.data.template
    if (_.isObject(str)) {
      str = JSON.stringify(str)
    }
    if (_.isNil(str) || _.isEmpty(str)) {
      str = '{"title":"", "text":""}'
    }
    const template = JSON.parse(str)
    this.data.template = template
  },
  methods: {
    getTemplate () {
      return JSON.stringify(this.data.template)
    }
  }
}
</script>
