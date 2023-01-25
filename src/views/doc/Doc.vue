<template>
  <div class="markdown">
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
        default: () => 'TCP_SERVER'
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
    mounted () {
      request.get(`/static/${this.type}.md`).then(resp => {
        this.initialValue = resp.data
      })
    }
}
</script>
