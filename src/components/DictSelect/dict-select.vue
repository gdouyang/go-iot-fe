<template>
  <a-select v-model="selectModel" v-bind="$attrs" @change="onChange">
    <a-select-option v-for="item in list" :value="item.value" :key="item.id">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'DictSelect',
  props: {
    // eslint-disable-next-line
    value: {
      type: [String, Number, Array] // , default: null
    },
    category: {
      type: String,
      default: null
    },
    valueType: {
      type: String,
      default: 'string' // number
    }
  },
  created () {
    this.selectModel = this.value
    this.getData()
  },
  watch: {
    value (newVal, oldVal) {
      this.selectModel = this.value
    }
  },
  data () {
    return {
      list: [],
      selectModel: ''
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.selectModel)
      this.$emit('change', this.selectModel)
    },
    getData () {
      this.$http.get(`dict/list-by-category?category=${this.category}`)
      .then(data => {
        if (data.success) {
          _.forEach(data.result, r => {
            if (this.valueType === 'number') {
              r.value = _.toNumber(r.value)
            }
          })
          this.list = data.result
        }
      })
    }
  }
}

</script>
