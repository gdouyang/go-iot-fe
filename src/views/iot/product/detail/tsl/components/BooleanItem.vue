<template>
  <div>
    <a-form-model-item label="布尔值" style="height: 69px">
      <a-col :span="11">
        <a-input v-model="data.trueText" placeholder="trueText"/>
      </a-col>
      <a-col :span="2" :push="1">
        ~
      </a-col>
      <a-col :span="11">
        <a-form-model-item>
          <a-input v-model="data.trueValue" placeholder="trueValue"/>
        </a-form-model-item>
      </a-col>
    </a-form-model-item>
    <a-form-model-item style="height: 69px">
      <a-col :span="11">
        <a-input v-model="data.falseText" placeholder="falseText"/>
      </a-col>
      <a-col :span="2" :push="1">
        ~
      </a-col>
      <a-col :span="11">
        <a-form-model-item>
          <a-input v-model="data.falseValue" placeholder="falseValue"/>
        </a-form-model-item>
      </a-col>
    </a-form-model-item>
  </div>
</template>

<script>
export default {
  name: 'BooleanItem',
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
