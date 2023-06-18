
<template>
  <a-drawer
    title="编辑属性"
    placement="right"
    :closable="false"
    visible
    width="30%"
    class="footer-drawer"
  >
    <a-form-model :model="formData" ref="form">
      <a-form-model-item
        label="属性标识"
        prop="id"
        :rules="[
          { required: true, message: '请输入属性标识' },
          { max: 32, message: '属性标识不超过32个字符' },
          { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '属性标识只能由数字、字母、下划线、中划线组成' }
        ]"
      >
        <a-input v-model="formData.id" placeholder="请输入属性标识" :disabled="isEdit"/>
      </a-form-model-item>
      <a-form-model-item
        label="属性名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入属性名称' },
          { max: 200, message: '属性名称不超过200个字符' }
        ]"
      >
        <a-input v-model="formData.name" placeholder="请输入属性名称"/>
      </a-form-model-item>
      <!-- -->
      <DataTypeItem
        label="数据类型"
        :data="formData"
        field="valueType"
        prop="valueType.type"
        :rules="[{ required: true, message: '请选择' }]"
      />
      <!-- -->
      <!-- <a-form-model-item
        label="是否只读"
        prop="expands.readOnly"
        :rules="[ { required: true, message: '请选择' } ]"
      >
        <a-radio-group v-model="formData.expands.readOnly">
          <a-radio value="true">是</a-radio>
          <a-radio value="false">否</a-radio>
        </a-radio-group>
      </a-form-model-item> -->
      <a-form-model-item label="描述" prop="description">
        <a-textarea v-model="formData.description" :rows="3"/>
      </a-form-model-item>
    </a-form-model>
    <div class="drawer-footer">
      <a-button style="margin-right: 8px" @click="$emit('close')">关闭</a-button>
      <a-button type="primary" @click="saveData">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import _ from 'lodash'
import DataTypeItem from '../components/DataTypeItem.vue'

import { getPropertiesData } from '../components/data.js'
const defaultFormData = getPropertiesData()
export default {
  name: 'PropertiesAdd',
  components: {
    DataTypeItem
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    this.formData = _.cloneDeep(_.assign({}, defaultFormData, this.data))
    if (this.data && this.data.id) {
      this.isEdit = true
    }
  },
  data () {
    return {
      formData: _.cloneDeep(defaultFormData),
      isEdit: false
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
          this.$emit('save', this.formData)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
