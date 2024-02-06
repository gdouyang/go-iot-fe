<template>
  <div class="markdown">
    <h1 v-if="$route.meta.doc">{{ $route.meta.doc }}文档说明</h1>
    <MarkdownPreview :initialValue="initialValue" :markedOptions="markedOptions"/>
  </div>
</template>

<script>
import axios from 'axios'
import { MarkdownPreview } from 'vue-meditor'
const request = axios.create({
  timeout: 20000
})
export default {
    name: 'MyMarkdown',
    components: {
      MarkdownPreview
    },
    props: {
      type: {
        type: String,
        default: () => ''
      }
    },
    data () {
      return {
        initialValue: '',
        markedOptions: {
          baseUrl: 'static/'
        }
      }
    },
    watch: {
      '$route.fullPath': {
        handler (to, from) {
          console.log(this)
          this.getData()
        }
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      getData () {
        let t = this.type
        if (!t) {
          t = this.$route.meta.doc
        }
        request.get(`/static/doc/${t}.md`).then(resp => {
          this.initialValue = resp.data
        })
      }
    }
}
</script>
<style lang="less" scoped>
.markdown :deep(.markdown-preview) {
  padding-top: 0px !important;
}
</style>
