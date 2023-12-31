
<template>
  <div>
    <a-drawer
      title="编辑功能定义"
      placement="right"
      :closable="false"
      visible
      width="30%"
      class="footer-drawer"
    >
      <a-form-model :model="formData" ref="form">
        <a-form-model-item
          label="功能标识"
          prop="id"
          :rules="[
            { required: true, message: '请输入功能标识' },
            { max: 32, message: '功能标识不超过32个字符' },
            { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '功能标识只能由数字、字母、下划线、中划线组成' }
          ]"
        >
          <a-input v-model="formData.id" placeholder="请输入功能标识" :disabled="isEdit"/>
        </a-form-model-item>
        <a-form-model-item
          label="功能名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入功能名称' },
            { max: 200, message: '功能名称不超过200个字符' }
          ]"
        >
          <a-input v-model="formData.name" placeholder="请输入功能名称"/>
        </a-form-model-item>
        <a-form-model-item
          label="是否异步"
          prop="async"
          :rules="[ { required: true, message: '请选择' } ]"
        >
          <a-radio-group v-model="formData.async">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="采集间隔(秒)"
          prop="expands.interval"
          v-if="product.networkType === 'MODBUS'"
        >
          <a-input-number
            v-model="formData.expands.interval"
            :precision="0"
            :min="0"
            :max="65535"
            :step="1"
            placeholder="采集间隔(秒)"
            style="width:100%"/>
        </a-form-model-item>
        <a-form-model-item
          label="输入参数"
        >
          <a-list bordered :dataSource="inputs" v-if="inputs.length > 0">
            <template slot="renderItem" slot-scope="item">
              <a-list-item>
                参数名称：{{ item.name }}
                <template slot="actions">
                  <a-button
                    type="link"
                    @click="editInput(item)"
                  >
                    编辑
                  </a-button>
                  <a-button
                    type="link"
                    @click="removeInput(item)"
                  >
                    删除
                  </a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
          <a-button
            type="link"
            @click="addInput"
          >
            <a-icon type="plus" />
            添加参数
          </a-button>
        </a-form-model-item>
        <!-- -->
        <DataTypeItem label="输出参数" :data="formData.output" />
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
      v-if="inputVisible"
      :data="currentParameter"
      @close="closeInput"
      @save="saveInput"/>
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

import { getPropertiesData, getFunctionsData } from '../components/data.js'
const defaultFormData = getFunctionsData()
export default {
  name: 'FunctionsAdd',
  components: {
    DataTypeItem,
    Paramter
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
    this.formData = getFunctionsData(this.data)
    this.inputs = this.formData.inputs
    if (this.data && this.data.id) {
      this.isEdit = true
    }
  },
  data () {
    return {
      formData: _.assign({}, defaultFormData),
      isEdit: false,
      inputs: [],
      inputVisible: false,
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
          if (this.formData.output.type !== 'object') {
            delete this.formData.output.properties
          }
          if (this.formData.output.type !== 'array') {
            delete this.formData.output.elementType
          }
          if (!this.formData.output.type) {
            this.formData.output = {}
          }
          this.formData.expands.interval = _.toString(this.formData.expands.interval)
          this.$emit('save', this.formData)
        }
      })
    },
    addInput () {
      this.currentParameter = getPropertiesData()
      this.inputVisible = true
    },
    editInput (item) {
      this.currentParameter = getPropertiesData(item)
      this.inputVisible = true
    },
    removeInput (item) {
      const index = this.inputs.findIndex((i) => i.id === item.id)
      this.inputs.splice(index, 1)
    },
    saveInput (item) {
      const index = this.formData.inputs.findIndex((e) => e.id === item.id)
      if (index === -1) {
        this.formData.inputs.push(item)
      } else {
        this.$set(this.formData.inputs, index, item)
      }
      this.closeInput()
    },
    closeInput () {
      this.inputVisible = false
    },
    saveOutput (item) {
      this.formData.output = item
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
