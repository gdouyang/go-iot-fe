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

    <PageTable ref="tb" url="/notifier/config/page" :columns="columns">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="remove(record)">删除</a>
        <a-divider type="vertical" />
        <a @click="showHistory(record)">通知记录</a>
      </span>
    </PageTable>

    <ConfigAdd ref="modal" @success="handleOk"></ConfigAdd>
    <NoticeHistory ref="NoticeHistory" ></NoticeHistory>

  </a-card>
</template>

<script>
// import _ from 'lodash'
import { remove } from '@/views/notice/api.js'
import ConfigAdd from './modules/ConfigAdd'
import NoticeHistory from './modules/NoticeHistory'
// import encodeQueryParam from '@/utils/encodeParam.js'
export default {
  name: 'ProjectList',
  components: {
    ConfigAdd,
    NoticeHistory
  },
  data () {
    return {
      // 查询参数
      queryParam: {
        name: ''
      },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          dataIndex: 'type',
          title: '通知类型'
        },
        {
          title: '操作',
          width: '250px',
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
          remove(row.id).then(data => {
            if (data.success) {
              _this.$message.success('操作成功')
              _this.handleOk()
            }
          })
        }
      })
    },
    showHistory (data) {
      this.$refs.NoticeHistory.open(data.id)
    }
  }
}
</script>
