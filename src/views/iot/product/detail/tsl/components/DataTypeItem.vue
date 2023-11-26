<template>
  <div>
    <a-form-model-item
      :label="label"
      :rules="rules"
    >
      <a-select
        v-model="data.type"
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
        <a-select-opt-group label="其他类型" v-if="showOtherGroup">
          <a-select-option value="date">date(时间型)</a-select-option>
          <a-select-option value="enum">enum(枚举)</a-select-option>
          <!-- <a-select-option value="array">array(数组)</a-select-option> -->
          <a-select-option value="object">object(结构体)</a-select-option>
          <!-- <a-select-option value="file">file(文件)</a-select-option> -->
          <a-select-option value="password">password(密码)</a-select-option>
          <!-- <a-select-option value="geoPoint">geoPoint(地理位置)</a-select-option> -->
        </a-select-opt-group>
      </a-select>
    </a-form-model-item>
    <!-- -->
    <template v-if="['float', 'double'].indexOf(data.type) !== -1">
      <NumberItem :data="data" />
    </template>
    <template v-else-if="['int', 'long'].indexOf(data.type) !== -1">
      <IntegerItem :data="data" />
    </template>
    <template v-else-if="['string'].indexOf(data.type) !== -1">
      <StringItem :data="data" />
    </template>
    <template v-else-if="['bool'].indexOf(data.type) !== -1">
      <BooleanItem :data="data" />
    </template>
    <template v-else-if="['date'].indexOf(data.type) !== -1">
      <DateItem :data="data" />
    </template>
    <template v-else-if="['enum'].indexOf(data.type) !== -1">
      <EnumItem :data="data" />
    </template>
    <template v-else-if="['password'].indexOf(data.type) !== -1">
      <PasswordItem :data="data" />
    </template>
    <template v-else-if="['file'].indexOf(data.type) !== -1">
      <FileItem :data="data" />
    </template>
    <template v-else-if="['array'].indexOf(data.type) !== -1">
      <DataTypeItemSimple
        label="元素类型"
        :data="data"
        field="elementType"
        :showOtherGroup="false"
        :prop="field + '.elementType.type'"
        :rules="[{ required: true, message: '请选择' }]"
      />
    </template>
    <template v-else-if="['object'].indexOf(data.type) !== -1">
      <ObjectItem :data="data" />
    </template>
  </div>
</template>

<script>
import IntegerItem from './IntegerItem.vue'
import NumberItem from './NumberItem.vue'
import StringItem from './StringItem.vue'
import BooleanItem from './BooleanItem.vue'
import DateItem from './DateItem.vue'
import EnumItem from './EnumItem.vue'
import PasswordItem from './PasswordItem.vue'
import FileItem from './FileItem.vue'
import ObjectItem from './ObjectItem.vue'
import DataTypeItemSimple from './DataTypeItemSimple.vue'

export default {
  name: 'DataTypeItem',
  components: {
    IntegerItem,
    NumberItem,
    StringItem,
    BooleanItem,
    DateItem,
    EnumItem,
    PasswordItem,
    FileItem,
    ObjectItem,
    DataTypeItemSimple
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {}
    },
    showOtherGroup: {
      type: Boolean,
      default: true
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
      if (['float', 'double'].indexOf(value) !== -1) {
        this.setValue('scale', null)
        this.setValue('unit', null)
      } else if (['int', 'long'].indexOf(value) !== -1) {
        this.setValue('unit', null)
      } else if (['string', 'password'].indexOf(value) !== -1) {
        this.setValue('max', 64)
      } else if (['bool'].indexOf(value) !== -1) {
        this.setValue('trueText', null)
        this.setValue('trueValue', null)
        this.setValue('falseText', null)
        this.setValue('falseValue', null)
      } else if (['date'].indexOf(value) !== -1) {
        this.setValue('format', null)
      } else if (['enum'].indexOf(value) !== -1) {
        this.setValue('elements', null)
      } else if (['file'].indexOf(value) !== -1) {
        this.setValue('bodyType', 'url') // url, base64
      } else if (['array'].indexOf(value) !== -1) {
        this.setValue('elementType', { type: null })
      } else if (['object'].indexOf(value) !== -1) {
        this.setValue('properties', [])
      }
      console.log(value)
    },
    setValue (key, value) {
      this.$set(this.data, key, value)
    }
  }
}
</script>
