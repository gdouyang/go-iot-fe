
<template>
  <div>
    <a-drawer
      title="编辑事件定义"
      placement="right"
      :closable="false"
      visible
      width="30%"
      class="footer-drawer"
    >
      <a-form-model :model="formData" ref="form">
        <a-form-model-item
          label="事件标识"
          prop="id"
          :rules="[
            { required: true, message: '请输入事件标识' },
            { max: 32, message: '事件标识不超过32个字符' },
            { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '事件标识只能由数字、字母、下划线、中划线组成' }
          ]"
        >
          <a-input v-model="formData.id" placeholder="请输入事件标识" :disabled="isEdit"/>
        </a-form-model-item>
        <a-form-model-item
          label="事件名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入事件名称' },
            { max: 200, message: '事件名称不超过200个字符' }
          ]"
        >
          <a-input v-model="formData.name" placeholder="请输入事件名称"/>
        </a-form-model-item>
        <a-form-model-item
          label="事件级别"
          prop="expands.level"
          :rules="[ { required: true, message: '请选择' } ]"
        >
          <a-radio-group v-model="formData.expands.level">
            <a-radio value="ordinary">普通</a-radio>
            <a-radio value="warn">警告</a-radio>
            <a-radio value="urgent">紧急</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- -->
        <DataTypeItem
          label="输出参数"
          :data="formData"
          field="valueType"
          prop="valueType.type"
          :rules="[{ required: true, message: '请选择' }]"
        />
        <!-- -->
        <a-form-model-item label="描述" prop="description">
          <a-textarea v-model="formData.description" :rows="3"/>
        </a-form-model-item>
      </a-form-model>
      <div class="drawer-footer">
        <a-button style="margin-right: 8px" @click="$emit('close')">关闭</a-button>
        <a-button type="primary" @click="saveData">保存</a-button>
      </div>
    </a-drawer>
    <Paramter
      v-if="outputVisible"
      :data="currentParameter"
      @close="closeOutput"
      @save="saveOutput"/>
  </div>
</template>

<script>
import _ from 'lodash'
import DataTypeItem from '../components/DataTypeItem.vue'
import Paramter from '../add/Paramter.vue'

import { getEventsData } from '../components/data.js'
const defaultFormData = getEventsData()
export default {
  name: 'EventsAdd',
  components: {
    DataTypeItem,
    Paramter
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    unitsData: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.formData = getEventsData(this.data)
    if (this.data && this.data.id) {
      this.isEdit = true
    }
  },
  data () {
    return {
      formData: _.assign({}, defaultFormData),
      isEdit: false,
      outputVisible: false
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    saveData () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.formData.valueType.type !== 'object') {
            delete this.formData.valueType.properties
          }
          if (this.formData.valueType.type !== 'array') {
            delete this.formData.valueType.elementType
          }
          this.$emit('save', this.formData)
        }
      })
    },
    saveOutput (item) {
      this.data.valueType.properties = item
      this.closeOutput()
    },
    closeOutput () {
      this.outputVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
