<style lang="less">
</style>

<template>
  <div>
    <a-form-model-item
      label="标题"
      prop="template.subject"
      :rules="[
        { max: 255, message: '长度不超过255' }
      ]">
      <a-input v-model="data.template.subject"/>
    </a-form-model-item>
    <a-form-model-item
      label="正文"
      prop="template.text"
      :rules="[
        { required: true, message: '请输入正文' },
        { max: 5120, message: '长度不超过5120' }
      ]"
    >
      <a-textarea
        :rows="8"
        placeholder="html"
        v-model="data.template.text"
        :max-length="60000"
      />
      <!-- <WangEditor
        v-model="data.template.text"
      /> -->
    </a-form-model-item>
  </div>
</template>

<script>
import _ from 'lodash'
import WangEditor from '@/components/Editor/WangEditor.vue'
export default {
  name: 'Email',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  components: {
    WangEditor
  },
  data () {
    return {
      template: {}
    }
  },
  created () {
    let str = this.data.template
    if (_.isEmpty(str)) {
      str = '{"subject":"", "text":""}'
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
