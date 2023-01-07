<template>
  <div class="markdown">
    <MarkdownPreview :initialValue="initialValue"/>
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
    data () {
      return {
        initialValue: ''
      }
    },
    mounted () {
      request.get('/static/TCP_SERVER.md').then(resp => {
        this.initialValue = resp.data
      })
    }
}
</script>
