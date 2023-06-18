<template>
  <div>
    <a-form-model-item
      :label="label"
      :prop="prop"
      :rules="rules"
    >
      <a-select
        v-model="data[field].type"
        placeholder="请选择"
        @change="typeChange"
      >
        <a-select-opt-group label="基本类型">
          <a-select-option value="int">int(整数型)</a-select-option>
          <a-select-option value="long">long(长整数型)</a-select-option>
          <a-select-option value="float">float(单精度浮点型)</a-select-option>
          <a-select-option value="double">double(双精度浮点数)</a-select-option>
          <a-select-option value="string">text(字符串)</a-select-option>
          <a-select-option value="bool">bool(布尔型)</a-select-option>
        </a-select-opt-group>
      </a-select>
    </a-form-model-item>
    <!-- -->
    <template v-if="['float', 'double'].indexOf(data[field].type) !== -1">
      <NumberItem :data="data[field]" />
    </template>
    <template v-else-if="['int', 'long'].indexOf(data[field].type) !== -1">
      <IntegerItem :data="data[field]" />
    </template>
    <template v-else-if="['string'].indexOf(data[field].type) !== -1">
      <StringItem :data="data[field]" />
    </template>
    <template v-else-if="['bool'].indexOf(data[field].type) !== -1">
      <BooleanItem :data="data[field]" />
    </template>
  </div>
</template>

<script>
import IntegerItem from './IntegerItem.vue'
import NumberItem from './NumberItem.vue'
import StringItem from './StringItem.vue'
import BooleanItem from './BooleanItem.vue'

export default {
  name: 'DataTypeItemSimple',
  components: {
    IntegerItem,
    NumberItem,
    StringItem,
    BooleanItem
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: 'valueType'
    },
    data: {
      type: Object,
      default: () => {}
    },
    prop: {
      type: String,
      default: undefined
    },
    rules: {
      type: Array,
      default: () => []
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
    typeChange (value) {
      const data = this.data
      const field = this.field
      let valueType = data[field]
      if (['float', 'double'].indexOf(value) !== -1) {
        valueType = { scale: null, unit: null }
      } else if (['int', 'long'].indexOf(value) !== -1) {
        valueType = { unit: null }
      } else if (['string'].indexOf(value) !== -1) {
        valueType = { max: null }
      } else if (['bool'].indexOf(value) !== -1) {
        valueType = { trueText: null, trueValue: null, falseText: null, falseValue: null }
      } else {
        this.$message.error('不支持类型' + value)
      }
      valueType.type = value
      data[field] = valueType
      console.log(value)
    }
  }
}
</script>
