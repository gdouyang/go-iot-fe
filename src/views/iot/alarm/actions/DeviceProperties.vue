<template>
  <div>
    <div v-if="propertiesData.valueType.type === 'enum'">
      <a-col :span="4">
        <a-select placeholder="选择属性值" :defaultValue="defaultValue" @change="selectChange">
          <a-select-option
            v-for="item in propertiesData.valueType.elements"
            :key="item.value">{{ `${item.text}（${item.value}）` }}</a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else-if="propertiesData.valueType.type === 'array'">
      <a-col :span="24">
        <a-row v-for="(value, index) in arrayData" :key="`array_${index}`">
          <a-col :span="4">
            <a-input v-model="arrayData[index]" @change="arrayInputChange($event, index)" />
          </a-col>
          <a-col :span="2">
            <template v-if="index === 0">
              <a-icon
                v-if="(arrayData.length - 1) === 0 "
                type="plus-circle"
                @click="arrayPlus"
              />
              <a-icon
                v-else
                type="minus-circle"
                @click="arrayMinus(index)"
              />
            </template>
            <template v-else>
              <a-row v-if="index === (arrayData.length - 1)">
                <a-icon type="plus-circle" @click="arrayPlus" />
                <a-icon style="paddingLeft: 10" type="minus-circle" @click="arrayMinus(index)" />
              </a-row>
              <a-icon
                v-else
                type="minus-circle"
                @click="arrayMinus(index)"
              />
            </template>
          </a-col>
        </a-row>
      </a-col>
    </div>
    <div v-else-if="propertiesData.valueType.type === 'boolean'">
      <a-col
        v-if="$_.isNil(propertiesData.valueType.trueValue) || $_.isNil(propertiesData.valueType.falseValue)"
        :span="4"
      >
        <a-input
          key="value"
          placeholder="填写属性值"
          :defaultValue="defaultValue"
          @change="inputChange"/>
      </a-col>
      <a-col :span="4" v-else>
        <a-select placeholder="选择属性值" :defaultValue="defaultValue" @change="selectChange">
          <a-select-option :key="propertiesData.valueType.trueValue+''">
            {{ `${propertiesData.valueType.trueText}（${propertiesData.valueType.trueValue}）` }}
          </a-select-option>
          <a-select-option :key="propertiesData.valueType.falseValue+''">
            {{ `${propertiesData.valueType.falseText}（${propertiesData.valueType.falseValue}）` }}
          </a-select-option>
        </a-select>
      </a-col>
    </div>
    <div v-else-if="propertiesData.valueType.type === 'object'">
      <a-col
        :span="24"
        v-for="(item, index) in propertiesData.valueType.properties"
        :key="`object${item.id}_${index}`">
        <div>
          <a-col :span="4">
            <a-input :value="`${item.name}(${item.id})`" :disabled="true"/>
          </a-col>
          <PropertiesObject :properties="item" :actionData="actionData" :propertiesData="propertiesData"/>
        </div>
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
import _ from 'lodash'
import PropertiesObject from './DevicePropertiesObject.vue'
export default {
  name: 'DeviceProperties',
  props: {
    propertiesData: {
      type: Object,
      default: () => {}
    },
    actionData: {
      type: Object,
      default: () => {}
    },
    arrayData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    PropertiesObject
  },
  watch: {
    actionData: {
      handler () {
        this.setDefaultValue()
      },
      deep: true
    }
  },
  created () {
    this.setDefaultValue()
  },
  data () {
    return {
      defaultValue: ''
    }
  },
  methods: {
    setDefaultValue () {
      const propertiesData = this.propertiesData
      const actionData = this.actionData
      this.defaultValue = actionData.configuration.message.properties[propertiesData.id] || undefined
    },
    selectChange (value) {
      const propertiesData = this.propertiesData
      this.actionData.configuration.message.properties[propertiesData.id] = value
    },
    inputChange ($event) {
      const propertiesData = this.propertiesData
      this.actionData.configuration.message.properties[propertiesData.id] = $event.target.value
    },
    arrayInputChange ($event, index) {
      const actionData = this.actionData
      const propertiesData = this.propertiesData
      const arrayData = this.arrayData
      arrayData[index] = $event.target.value
      actionData.configuration.message.properties[propertiesData.id] = arrayData
    },
    arrayPlus () {
      const actionData = this.actionData
      const propertiesData = this.propertiesData
      const arrayData = this.arrayData
      arrayData.push(undefined)
      actionData.configuration.message.properties[propertiesData.id] = arrayData
    },
    arrayMinus (index) {
      const actionData = this.actionData
      const propertiesData = this.propertiesData
      _.isEmpty(index)
      // const newArray = _.filter(this.arrayData, (val, idx) => idx !== index)
      // this.$emit('udpate:arrayData', newArray)
      // const arrayData = newArray
      const arrayData = this.arrayData
      arrayData.splice(index, 1)
      actionData.configuration.message.properties[propertiesData.id] = arrayData
    }
  }
}
</script>
