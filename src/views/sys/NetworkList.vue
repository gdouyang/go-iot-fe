<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="端口">
              <a-input v-model="queryParam.port" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <PageTable
      ref="table"
      size="default"
      url="server/list"
      :columns="columns"
    >
    </PageTable>

  </a-card>
</template>

<script>
export default {
  name: 'NetworkList',
  components: {
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '产品', dataIndex: 'productId' },
        { title: '网络类型', dataIndex: 'type' },
        // { title: '名称', dataIndex: 'name' },
        { title: '端口', dataIndex: 'port' },
        { title: '状态', dataIndex: 'state' },
        { title: '创建时间', dataIndex: 'createTime' }
        // { title: '操作', width: '150px', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  computed: {
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      const condition = []
      if (this.queryParam.port) {
        condition.push({ key: 'port', value: this.queryParam.port })
      }
      if (this.queryParam.name) {
        condition.push({ key: 'name', value: this.queryParam.name, oper: 'LIKE' })
      }
      this.$refs.table.search(condition)
    },
    resetSearch () {
      this.queryParam = {}
      this.search()
    }
  }
}
</script>
