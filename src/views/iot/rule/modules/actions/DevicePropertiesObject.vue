<template>
  <div>
    <div v-if="properties.type === 'enum'">
      <a-col :span="4">
        <a-select
          placeholder="选择属性值"
          :defaultValue="defaultValue"
          @change="selectChange"
        >
          <a-select-option
            v-if="item in properties.elements"
            :key="item.value">{{ `${item.text}（${item.value}）` }}</a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else-if="properties.type === 'bool'">
      <a-col :span="4">
        <a-select
          placeholder="选择属性值"
          :defaultValue="defaultValue"
          @change="selectChange"
        >
          <a-select-option :key="properties.trueValue">
            {{ `${properties.trueText}（${properties.trueValue}）` }}
          </a-select-option>
          <a-select-option :key="properties.falseValue">
            {{ `${properties.falseText}（${properties.falseValue}）` }}
          </a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else>
      <a-col :span="4">
        <a-input
          key="value"
          placeholder="填写属性值"
          :defaultValue="defaultValue"
          @change="inputChange"/>
      </a-col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevicePropertiesObject',
  props: {
    properties: {
      type: Object,
      default: null
    },
    actionData: {
      type: Object,
      default: null
    },
    propertiesData: {
      type: Object,
      default: null
    }
  },
  components: {
  },
  created () {
    const propertiesData = this.propertiesData
    const properties = this.properties
    const actionData = this.actionData
    const message = actionData.configuration.message
    this.defaultValue = message && message.properties &&
      message.properties[propertiesData.id] &&
      message.properties[propertiesData.id][properties.id] || undefined
  },
  data () {
    return {
      defaultValue: ''
    }
  },
  methods: {
    selectChange (value) {
      const propertiesData = this.propertiesData
      const properties = this.properties
      if (!this.actionData.configuration.message.properties[propertiesData.id]) {
        this.actionData.configuration.message.properties[propertiesData.id] = {}
      }
      this.actionData.configuration.message.properties[propertiesData.id][properties.id] = value
    },
    inputChange ($event) {
      const propertiesData = this.propertiesData
      const properties = this.properties
      if (!this.actionData.configuration.message.properties[propertiesData.id]) {
        this.actionData.configuration.message.properties[propertiesData.id] = {}
      }
      this.actionData.configuration.message.properties[propertiesData.id][properties.id] = $event.target.value
    }
  }
}
</script>
