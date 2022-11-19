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
      label="收件人"
      :rules="[
        { required: true, message: '请输入收件人' }
      ]"
    >
      <a-tooltip title="多个收件人以 英文 ,  分隔">
        <a-textarea v-model="data.template.sendTo" :rows="3" placeholder="多个收件人以 英文 , 分隔"></a-textarea>
      </a-tooltip>
    </a-form-model-item>
    <a-form-model-item
      label="正文"
      prop="template.text"
      :rules="[
        { required: true, message: '请输入正文' },
        { max: 5120, message: '长度不超过5120' }
      ]"
    >
      <WangEditor
        v-model="data.template.text"
      />
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
    }
  },
  created () {
    const template = JSON.parse(this.data.template || '{"subject":"","sendTo":[],"text":""}')
    template.sendTo = _.join(template.sendTo, ',')
    this.data.template = template
  },
  methods: {
    getTemplate () {
      const data = _.cloneDeep(this.data)
      data.template.sendTo = _.split(data.template.sendTo, ',')
      return JSON.stringify(data.template)
    }
  }
}
</script>
