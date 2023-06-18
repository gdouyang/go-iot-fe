<template>
  <a-form-model-item label="单位">
    <a-input
      v-model="data.unit"
      maxlength="32"
      style="width:100%"/>
  </a-form-model-item>
</template>

<script>
export default {
  name: 'IntegerItem',
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
