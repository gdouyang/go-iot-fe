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
          <a-select-option value="boolean">bool(布尔型)</a-select-option>
        </a-select-opt-group>
        <a-select-opt-group label="其他类型" v-if="showOtherGroup">
          <a-select-option value="date">date(时间型)</a-select-option>
          <a-select-option value="enum">enum(枚举)</a-select-option>
          <a-select-option value="array">array(数组)</a-select-option>
          <a-select-option value="object">object(结构体)</a-select-option>
          <a-select-option value="file">file(文件)</a-select-option>
          <a-select-option value="password">password(密码)</a-select-option>
          <!-- <a-select-option value="geoPoint">geoPoint(地理位置)</a-select-option> -->
        </a-select-opt-group>
      </a-select>
    </a-form-model-item>
    <!-- -->
    <template v-if="['float', 'double'].indexOf(data[field].type) !== -1">
      <NumberItem :data="data[field]" />
    </template>
    <template v-else-if="['int', 'long'].indexOf(data[field].type) !== -1">
      <!-- <IntergeItem :data="data[field]" /> -->
    </template>
    <template v-else-if="['string'].indexOf(data[field].type) !== -1">
      <StringItem :data="data[field]" />
    </template>
    <template v-else-if="['boolean'].indexOf(data[field].type) !== -1">
      <BooleanItem :data="data[field]" />
    </template>
    <template v-else-if="['date'].indexOf(data[field].type) !== -1">
      <DateItem :data="data[field]" />
    </template>
    <template v-else-if="['enum'].indexOf(data[field].type) !== -1">
      <EnumItem :data="data[field]" />
    </template>
    <template v-else-if="['password'].indexOf(data[field].type) !== -1">
      <PasswordItem :data="data[field]" />
    </template>
    <template v-else-if="['file'].indexOf(data[field].type) !== -1">
      <FileItem :data="data[field]" />
    </template>
    <template v-else-if="['array'].indexOf(data[field].type) !== -1">
      <!-- <ArrayItem :data="data[field]" /> -->
      <DataTypeItem
        label="元素类型"
        :data="data[field]"
        field="elementType"
        :showOtherGroup="false"
        :prop="field + '.elementType.type'"
        :rules="[{ required: true, message: '请选择' }]"
      />
    </template>
    <template v-else-if="['object'].indexOf(data[field].type) !== -1">
      <ObjectItem :data="data[field]" />
    </template>
  </div>
</template>

<script>
import NumberItem from './NumberItem.vue'
import StringItem from './StringItem.vue'
import BooleanItem from './BooleanItem.vue'
import DateItem from './DateItem.vue'
import EnumItem from './EnumItem.vue'
import PasswordItem from './PasswordItem.vue'
import FileItem from './FileItem.vue'
import ArrayItem from './ArrayItem.vue'
import ObjectItem from './ObjectItem.vue'

export default {
  name: 'DataTypeItem',
  components: {
    NumberItem,
    StringItem,
    BooleanItem,
    DateItem,
    EnumItem,
    PasswordItem,
    FileItem,
    ArrayItem,
    ObjectItem
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
    unitsData: {
      type: Array,
      default: () => []
    },
    showOtherGroup: {
      type: Boolean,
      default: true
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
        valueType = { expands: { maxLength: null } }
      } else if (['boolean'].indexOf(value) !== -1) {
        valueType = { trueText: null, trueValue: null, falseText: null, falseValue: null }
      } else if (['date'].indexOf(value) !== -1) {
        valueType = { format: null }
      } else if (['enum'].indexOf(value) !== -1) {
        valueType = { elementType: { elements: null } }
      } else if (['password'].indexOf(value) !== -1) {
        valueType = { expands: { maxLength: null } }
      } else if (['file'].indexOf(value) !== -1) {
        valueType = { fileType: null }
      } else if (['array'].indexOf(value) !== -1) {
        valueType = { elementType: { type: null } }
      } else if (['object'].indexOf(value) !== -1) {
        valueType = { properties: [] }
      }
      valueType.type = value
      data[field] = valueType
      console.log(value)
    }
  }
}
</script>
