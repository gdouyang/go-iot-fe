<template>
  <div>
    <div v-if="item.type === 'enum'">
      <a-col :span="6">
        <a-select
          placeholder="选择调用参数"
          :value="defaultValue"
          @change="inputsChange"
        >
          <a-select-option v-for="_item in item.elements" :key="_item.value" :value="_item.value">
            {{ `${_item.text}（${_item.value}）` }}
          </a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else-if="item.type === 'bool'">
      <a-col :span="6">
        <a-select
          placeholder="选择调用参数"
          :value="defaultValue"
          @change="inputsChange"
        >
          <a-select-option :value="item.trueValue+''">
            {{ `${item.trueText}（${item.trueValue}）` }}
          </a-select-option>
          <a-select-option :value="item.falseValue+''">
            {{ `${item.falseText}（${item.falseValue}）` }}
          </a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else-if="item.type === 'int' || item.type === 'long' || item.type === 'float' || item.type === 'double'">
      <a-col :span="6">
        <a-input-number
          :value="defaultValue"
          @change="inputsChange"
        ></a-input-number>
      </a-col>
    </div>
    <div v-else-if="item.type === 'password'">
      <a-col :span="6">
        <a-input-password
          :value="defaultValue"
          @change="inputsChange"
          :maxLength="100">
        </a-input-password>
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
      const message = this.actionData.configuration
      const item = this.item
      if (item && message) {
        return message && message.data && message.data[item.id]
      }
      return null
    }
  },
  data () {
    return {
    }
  },
  methods: {
    inputsChange (value) {
      const item = this.item
      this.actionData.configuration.data = {}
      this.actionData.configuration.data[item.id] = value
    },
    inputsInputChange ($event) {
      const item = this.item
      this.actionData.configuration.data = {}
      this.actionData.configuration.data[item.id] = $event.target.value
    }
  }
}
</script>
