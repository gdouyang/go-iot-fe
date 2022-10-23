<template>
  <a-form-model-item label="密码长度">
    <a-input v-model="data.expands.maxLength" addonAfter="字节"/>
  </a-form-model-item>
</template>

<script>
export default {
  name: 'PasswordItem',
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
