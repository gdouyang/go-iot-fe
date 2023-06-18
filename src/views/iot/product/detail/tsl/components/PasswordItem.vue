<template>
  <a-form-model-item label="密码长度">
    <a-input-number
      v-model="data.max"
      :precision="0"
      :min="0"
      :step="1"
      style="width:100%"/>
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
