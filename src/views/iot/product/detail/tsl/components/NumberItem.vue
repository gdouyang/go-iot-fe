<template>
  <div>
    <a-form-model-item label="精度">
      <a-input-number
        v-model="data.scale"
        :precision="0"
        :min="0"
        :step="1"
        placeholder="小数点位数"
        style="width:100%"/>
    </a-form-model-item>
    <a-form-model-item label="单位">
      <a-input
        v-model="data.unit"
        maxlength="32"
        style="width:100%"/>
    </a-form-model-item>
  </div>
</template>

<script>
export default {
  name: 'NumberItem',
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
