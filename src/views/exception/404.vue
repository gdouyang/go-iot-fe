<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
      <a-button type="primary" @click="logout">
        Logout
      </a-button>
    </template>
  </a-result>
</template>

<script>
import store from '@/store'
export default {
  name: 'Exception404',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    },
    logout () {
      store.dispatch('Logout').then(() => {
        this.toHome()
      })
    }
  }
}
</script>
