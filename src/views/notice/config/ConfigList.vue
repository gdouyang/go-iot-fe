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

    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="remove(record)">删除</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认复制？"
          @confirm="copy(record)"
        >
          <a>复制</a>
        </a-popconfirm>
        <a-divider type="vertical"/>
        <span v-if="record.state !== 'stopped'">
          <a-popconfirm
            title="确认停止？"
            @confirm="stop(record)"
          >
            <a>停止</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a-popconfirm
            title="确认启动？"
            @confirm="start(record)"
          >
            <a>启动</a>
          </a-popconfirm>
        </span>
      </span>
    </PageTable>

    <ConfigAdd ref="modal" @success="handleOk"></ConfigAdd>
    <NoticeHistory ref="NoticeHistory" ></NoticeHistory>

  </a-card>
</template>

<script>
// import _ from 'lodash'
import { configTableUrl, remove, start, stop, copyNotify } from '@/views/notice/api.js'
import ConfigAdd from './modules/ConfigAdd'
import NoticeHistory from './modules/NoticeHistory'
// import encodeQueryParam from '@/utils/encodeParam.js'
export default {
  name: 'NotifyConfigList',
  components: {
    ConfigAdd,
    NoticeHistory
  },
  data () {
    return {
      url: configTableUrl,
      // 查询参数
      queryParam: {
        name: ''
      },
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '名称', dataIndex: 'name' },
        { title: '通知类型', dataIndex: 'type' },
        { title: '状态', dataIndex: 'state' },
        { title: '操作', width: '250px', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      const condition = []
      if (this.queryParam.name) {
        condition.push({ key: 'name', value: this.queryParam.username, oper: 'LIKE' })
      }
      this.$refs.tb.search(condition)
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
    copy (row) {
      copyNotify(row.id).then(data => {
        if (data.success) {
          this.$message.success('操作成功')
          this.handleOk()
        }
      })
    },
    start (item) {
      start(item.id).then(resp => {
        if (resp.success) {
           this.$message.success('启动成功')
           this.search()
        }
      })
    },
    stop (item) {
      stop(item.id).then((response) => {
        if (response.success) {
          this.$message.success('停止成功')
          this.search()
        }
      })
    },
    showHistory (data) {
      this.$refs.NoticeHistory.open(data.id)
    }
  }
}
</script>
