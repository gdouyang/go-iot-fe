<template>
  <a-form-model
    :model="formData"
    v-bind="formItemLayoutWithOutLabel"
  >
    <a-form-model-item
      v-for="(domain, index) in formData.items"
      :key="domain.id"
      :label="domain.name"
      :prop="'items.' + index + '.value'"
      v-bind="formItemLayout"
    >
      <template v-if="domain">
        <a-tooltip :title="domain.description">
          <a-input-number
            v-if="isNumber(domain.type)"
            v-model="domain.value"
            class="func-form-item"
          ></a-input-number>
          <!-- { "type": "bool", "trueText": "是", "trueValue": "1", "falseText": "否", "falseValue": "0" } -->
          <a-select
            v-else-if="isBool(domain.type)"
            v-model="domain.value"
            :allowClear="true"
            class="func-form-item"
          >
            <a-select-option :value="domain.trueValue">
              {{ domain.trueText }}
            </a-select-option>
            <a-select-option :value="domain.falseValue">
              {{ domain.falseText }}
            </a-select-option>
          </a-select>
          <a-select
            v-else-if="isEnum(domain.type)"
            v-model="domain.value"
            :allowClear="true"
            class="func-form-item"
          >
            <a-select-option
              v-for="(item) in domain.elements"
              :key="item.id"
              :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
          <a-input
            v-else-if="isDate(domain.type)"
            v-model="domain.value"
            class="func-form-item"
          />
          <a-input
            v-else
            v-model="domain.value"
            class="func-form-item"
          />
        </a-tooltip>
      </template>
      <a-input
        v-else
        v-model="domain.value"
        class="func-form-item"
      />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'FunctionForm',
  props: {
    inputs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 19, offset: 5 }
        }
      },
      formData: {
        items: []
      }
    }
  },
  mounted () {
    this.setData()
  },
  methods: {
    setData () {
      const data = {}
      const items = []
      _.forEach(this.inputs, item => {
        item = _.assign({}, item)
        item.value = null
        items.push(item)
      })
      data.items = items
      this.formData = data
    },
    getData () {
      const param = {}
      _.forEach(this.formData.items, item => {
        param[item.id] = item.value
      })
      return param
    },
    isNumber (type) {
      return type === 'int' || type === 'long' || type === 'double' || type === 'float'
    },
    isString (type) {
      return type === 'string'
    },
    isBool (type) {
      return type === 'bool'
    },
    isEnum (type) {
      return type === 'enum'
    },
    isDate (type) {
      return type === 'date'
    }
  }
}
</script>

<style lang="less" scoped>
.func-form-item {
  width: 60%;
  margin-right: 8px;
  /deep/ .ant-input-number-handler-wrap {
    opacity: 1;
  }
}
</style>
