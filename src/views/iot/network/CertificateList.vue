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
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
    </div>

    <PageTable ref="tb" url="network/certificate/page" :columns="columns">
      <span slot="action" slot-scope="text, record">
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确认删除？"
          @confirm="deleteScene(record.certificateId)"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
    </PageTable>

    <Add
      ref="modal"
      @success="handleOk"
    ></Add>

  </a-card>
</template>

<script>
import Add from './certificate/add.vue'

export default {
  name: 'SceneList',
  components: {
    Add
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        // {
        //   title: 'ID',
        //   dataIndex: 'id'
        // },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      this.$refs.tb.search(this.queryParam)
    },
    resetSearch () {
      this.queryParam = {}
      this.search()
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    edit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.search()
    },
    deleteScene (id) {
      this.doDelete(id)
      // this.$confirm({
      //   title: '确认',
      //   content: '确定要删除吗？',
      //   onOk: () => {
      //     this.doDelete(id)
      //   }
      // })
    },
    doDelete (id) {
      this.spinning = true
      this.$http.delete(`/network/certificate/${id}`)
      .then((response) => {
        this.spinning = false
        if (response.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    }
  }
}
</script>
