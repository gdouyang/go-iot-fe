<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null
    }
  },
  // watch: {
  //   value (val) {
  //     this.editor.txt.html(val)
  //   }
  // },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      this.editor = new WEditor(this.$refs.editor)
      // this.editor.onchangeTimeout = 200
      this.editor.customConfig.onchange = (html) => {
        this.$emit('input', html)
        // this.$emit('change', html)
      }
      this.editor.create()
      this.editor.txt.html(this.value)
    },
    setContent (val) {
      this.editor.txt.html(val)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>
