<template>
  <a-modal
    :title="titleVal"
    :width="width"
    :visible="modalStatus"
    v-bind="$attrs"
    :maskClosable="false"
    @cancel="close"
  >
    <div>
      <slot></slot>
    </div>
    <template slot="footer">
      <slot name="footer">
        <a-button key="back" @click="close">
          {{ cancelText }}
        </a-button>
        <a-button key="submit" :type="okType" @click="ok" :loading="okBtnLoading" v-if="showOk">
          {{ okText }}
        </a-button>
      </slot>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    title: {
      type: String,
      default: null
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showOk: {
      type: Boolean,
      default: true
    },
    okText: {
      type: String,
      default: '确定'
    },
    okType: {
      type: String,
      default: 'primary'
    },
    okBtnLoading: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 700
    }
  },
  data () {
    return {
      modalStatus: false,
      title_: ''
    }
  },
  computed: {
    titleVal () {
      if (this.title_) {
        return this.title_
      }
      return this.title
    }
  },
  methods: {
    open (config) {
      this.modalStatus = true
      if (config) {
        this.title_ = config.title
        if (config.onopen) {
          this.$nextTick(() => {
            config.onopen()
          })
        }
      }
    },
    close () {
      this.modalStatus = false
      this.$emit('close')
    },
    ok () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
