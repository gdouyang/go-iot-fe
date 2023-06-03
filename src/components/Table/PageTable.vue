<template>
  <div>
    <a-table v-bind="$attrs" :data-source="tableList" :loading="loading">
      <slot></slot>
    </a-table>
    <a-pagination v-model="queryParams.pageNum" :total="total" :pageSize.sync="queryParams.pageSize" show-less-items @change="pageChange"/>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      total: 0,
      tableList: [],
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    search (query) {
      if (this.$_.isArray(query)) {
        this.queryParams.condition = query
      } else {
        query = JSON.parse(JSON.stringify(query))
        query.pageNum = this.queryParams.pageNum
        query.pageSize = this.queryParams.pageSize
      }
      this.load()
    },
    pageChange (page, pageSize) {
      this.queryParams.pageNum = page
      this.queryParams.pageSize = pageSize
      this.load()
    },
    load () {
      this.loading = true
      this.$http.post(this.url, this.queryParams).then((response) => {
        this.tableList = response.result.list
        this.total = response.result.total
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
