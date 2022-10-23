<template>
  <div>
    <a-form-model-item label="枚举项">
      <a-row v-for="(item, index) in arrayEnumData" :key="item.id">
        <a-col :span="10">
          <a-input
            placeholder="标识"
            :value="item.value"
            @change="valueChange($event, index)" />
        </a-col>
        <a-col
          :span="1"
          :style="{ textAlign: 'center' }">
          <a-icon type="arrow-right" />
        </a-col>
        <a-col :span="10">
          <a-input
            placeholder="对该枚举项的描述"
            :value="item.text"
            @change="textChange($event, index)" />
        </a-col>
        <a-col
          :span="3"
          :style="{ textAlign: 'center' }">
          <template
            v-if="index === 0">
            <a-icon
              v-if="arrayEnumData.length - 1 === 0"
              type="plus-circle"
              @click="plus" />
            <a-icon
              v-else
              type="minus-circle"
              @click="minus(index)" />
          </template>
          <template v-else>
            <a-row
              v-if="index === arrayEnumData.length - 1">
              <a-icon
                type="plus-circle"
                @click="plus" />
              <a-icon
                :style="{ paddingLeft: 10 }"
                type="minus-circle"
                @click="minus(index)" />
            </a-row>
            <a-icon
              type="minus-circle"
              v-else
              @click="minus(index)" />
          </template>
        </a-col>
      </a-row>
    </a-form-model-item>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'EnumItem',
  components: {},
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
    if (_.has(this.data, 'elementType.elements')) {
      this.arrayEnumData = this.data.elementType.elements
    } else {
      this.arrayEnumData = [{ text: '', value: '', id: 0 }]
    }
  },
  data () {
    return {
      arrayEnumData: []
    }
  },
  mounted () {},
  methods: {
    valueChange (event, index) {
      this.arrayEnumData[index].value = event.target.value
      this.setArrayEnumData([...this.arrayEnumData])
    },
    textChange (event, index) {
      this.arrayEnumData[index].text = event.target.value
      this.setArrayEnumData([...this.arrayEnumData])
    },
    setArrayEnumData (datas) {
      this.arrayEnumData = datas
      this.data.elementType.elements = datas
    },
    plus () {
      this.setArrayEnumData([...this.arrayEnumData, { id: this.arrayEnumData.length + 1 }])
    },
    minus (index) {
      this.arrayEnumData.splice(index, 1)
      this.setArrayEnumData([...this.arrayEnumData])
    }
  }
}
</script>
