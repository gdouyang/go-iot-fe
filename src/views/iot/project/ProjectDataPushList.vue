<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="URL">
              <a-input v-model="queryParam.url" placeholder="请输入"/>
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

    <PageTable ref="tb" url="project-datapush/page" :columns="columns">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="remove(record)">删除</a>
        <a-divider type="vertical" />
        <a @click="pushLog(record)">日志</a>
      </span>
    </PageTable>

    <ProjectDataPushModal ref="modal" @success="handleOk"></ProjectDataPushModal>
    <ProjectDataPushLogModal ref="ProjectDataPushLogModal"></ProjectDataPushLogModal>

  </a-card>
</template>

<script>
import ProjectDataPushModal from './modules/ProjectDataPushModal.vue'
import ProjectDataPushLogModal from './modules/ProjectDataPushLogModal.vue'

export default {
  name: 'ProjectDataPushList',
  components: {
    ProjectDataPushModal,
    ProjectDataPushLogModal
  },
  data () {
    return {
      // 查询参数
      queryParam: {
        url: ''
      },
      // 表头
      columns: [
        {
          title: '分组',
          dataIndex: 'projectIdI18n'
        },
        {
          title: 'URL',
          dataIndex: 'url'
        },
        {
          title: '说明',
          dataIndex: 'desc'
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
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.search()
    },
    remove (row) {
      const _this = this
      this.$confirm({
        title: '确认',
        content: '确定要删除吗？',
        onOk: () => {
          _this.$http.delete(`project-datapush/${row.id}`)
          .then(data => {
            if (data.success) {
              _this.$message.success('操作成功')
              _this.handleOk()
            }
          })
        }
      })
    },
    pushLog (row) {
      this.$refs.ProjectDataPushLogModal.open(row)
    }
  }
}
</script>
