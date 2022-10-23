<template>
  <a-form-model-item label="最大长度">
    <a-input v-model="data.expands.maxLength" />
  </a-form-model-item>
</template>

<script>
export default {
  name: 'StringItem',
  components: {
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
  }
}
</script>
