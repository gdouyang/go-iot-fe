<template>
  <div>
    <div v-if="item.valueType.type === 'enum'">
      <a-col :span="6">
        <a-select
          placeholder="选择调用参数"
          :value="defaultValue"
          @change="inputsChange"
        >
          <a-select-option v-for="_item in item.valueType.elements" :key="_item.value" :value="_item.value">
            {{ `${_item.text}（${_item.value}）` }}
          </a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else-if="item.valueType.type === 'boolean'">
      <a-col :span="6">
        <a-select
          placeholder="选择调用参数"
          :value="defaultValue"
          @change="inputsChange"
        >
          <a-select-option :value="item.valueType.trueValue+''">
            {{ `${item.valueType.trueText}（${item.valueType.trueValue}）` }}
          </a-select-option>
          <a-select-option :value="item.valueType.falseValue+''">
            {{ `${item.valueType.falseText}（${item.valueType.falseValue}）` }}
          </a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else>
      <a-col :span="6">
        <a-input
          placeholder="填写调用参数"
          :value="defaultValue"
          @change="inputsInputChange"/>
      </a-col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceFunction',
  props: {
    item: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    actionData: {
      type: Object,
      default: null
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    defaultValue () {
      const message = this.actionData.configuration.message
      return message && message.inputs && message.inputs[this.index] && message.inputs[this.index].value
    }
  },
  data () {
    return {
    }
  },
  methods: {
    inputsChange (value) {
      const index = this.index
      const item = this.item
      this.actionData.configuration.message.inputs.splice(index, 1, { name: item.id, value: value })
    },
    inputsInputChange ($event) {
      const index = this.index
      const item = this.item
      this.actionData.configuration.message.inputs.splice(index, 1, {
        name: item.id,
        value: $event.target.value
      })
    }
  }
}
</script>
