<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="searchObj.name" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="类型">
              <a-select v-model="searchObj.type" :allowClear="true">
                <a-select-option v-for="item in typeList" :key="item.type" :value="item.type">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="searchObj.state" :allowClear="true">
                <a-select-option value="stopped">停止</a-select-option>
                <a-select-option value="started">启动</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd" v-action:notify-config:add>新建</a-button>
    </div>

    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="state" slot-scope="text">
        <a-tag color="#87d068" v-if="text === 'started'">{{ text }}</a-tag>
        <a-tag color="#f50" v-else>{{ text }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-action:notify-config:save>编辑</a>
        <span v-action:notify-config:delete>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        <span v-action:notify-config:add>
          <a-divider type="vertical" />
          <a-popconfirm title="确认复制？" @confirm="copy(record)">
            <a>复制</a>
          </a-popconfirm>
        </span>
        <span v-action:notify-config:save>
          <a-divider type="vertical"/>
          <a-popconfirm title="确认停止？" @confirm="stop(record)" v-if="record.state !== 'stopped'">
            <a>停止</a>
          </a-popconfirm>
          <a-popconfirm title="确认启动？" @confirm="start(record)" v-else>
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
import { configTableUrl, remove, start, stop, copyNotify, configTypes } from '@/views/notice/api.js'
import ConfigAdd from './modules/ConfigAdd'
import NoticeHistory from './modules/NoticeHistory'
// import encodesearchObj from '@/utils/encodeParam.js'
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
      searchObj: {
        name: ''
      },
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '名称', dataIndex: 'name' },
        { title: '通知类型', dataIndex: 'type' },
        { title: '状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
        { title: '创建时间', dataIndex: 'createTime' },
        { title: '操作', width: '250px', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ],
      typeList: []
    }
  },
  mounted () {
    this.search()
    configTypes().then(result => {
      this.typeList = result
    })
  },
  methods: {
    search () {
      const condition = []
      if (this.searchObj.name) {
        condition.push({ key: 'name', value: this.searchObj.name, oper: 'LIKE' })
      }
      if (this.searchObj.state) {
        condition.push({ key: 'state', value: this.searchObj.state })
      }
      if (this.searchObj.type) {
        condition.push({ key: 'type', value: this.searchObj.type })
      }
      this.$refs.tb.search(condition)
    },
    resetSearch () {
      this.searchObj = {}
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
      remove(row.id).then(data => {
        if (data.success) {
          _this.$message.success('操作成功')
          _this.handleOk()
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
