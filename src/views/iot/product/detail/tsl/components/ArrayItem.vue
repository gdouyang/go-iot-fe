<template>
  <div>
    <a-form-model-item
      label="元素类型"
      prop="valueType.elementType.type"
      :rules="[{ required: true, message: '请选择' }]">
      <a-select
        placeholder="请选择"
        v-model="data.elementType.type"
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
        <!-- 简化产品object、array只能放基本类型 -->
        <!-- <a-select-opt-group label="其他类型">
          <a-select-option value="date">date(时间型)</a-select-option>
          <a-select-option value="enum">enum(枚举)</a-select-option>
          <a-select-option value="object">object(结构体)</a-select-option>
          <a-select-option value="file">file(文件)</a-select-option>
          <a-select-option value="password">password(密码)</a-select-option>
          <a-select-option value="geoPoint">geoPoint(地理位置)</a-select-option>
        </a-select-opt-group> -->
      </a-select>
    </a-form-model-item>
    <!-- -->
    <template v-if="['float', 'double'].indexOf(data.elementType.type) !== -1">
      <NumberItem :data="data.elementType" />
    </template>
    <template v-else-if="['int', 'long'].indexOf(data.elementType.type) !== -1">
      <!-- <IntergeItem :data="formData.elementType" /> -->
    </template>
    <template v-else-if="['string'].indexOf(data.elementType.type) !== -1">
      <StringItem :data="data.elementType" />
    </template>
    <template v-else-if="['boolean'].indexOf(data.elementType.type) !== -1">
      <BooleanItem :data="data.elementType" />
    </template>
  </div>
</template>

<script>
import NumberItem from './NumberItem.vue'
import StringItem from './StringItem.vue'
import BooleanItem from './BooleanItem.vue'
export default {
  name: 'ArrayItem',
  components: {
    NumberItem,
    StringItem,
    BooleanItem
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
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    typeChange (value) {
      let valueType = this.data.elementType
      if (['float', 'double'].indexOf(value) !== -1) {
        valueType = { scale: null, unit: null }
      } else if (['int', 'long'].indexOf(value) !== -1) {
        valueType = { unit: null }
      } else if (['string'].indexOf(value) !== -1) {
        valueType = { expands: { maxLength: null } }
      } else if (['boolean'].indexOf(value) !== -1) {
        valueType = { trueText: null, trueValue: null, falseText: null, falseValue: null }
      }
      valueType.type = value
      this.data.elementType = valueType
      console.log(value)
    }
  }
}
</script>
