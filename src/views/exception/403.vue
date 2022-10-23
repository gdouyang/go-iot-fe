<template>
  <a-result status="403" title="403" sub-title="Sorry, you don't have access to this page.">
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
  name: 'Exception403',
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
