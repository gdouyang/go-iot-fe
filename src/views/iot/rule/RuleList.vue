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
            <a-form-item label="状态">
              <a-select v-model="searchObj.state" :allowClear="true">
                <a-select-option value="stopped">停止</a-select-option>
                <a-select-option value="started">启动</a-select-option>
              </a-select>
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
      <a-button type="primary" icon="plus" @click="handleAdd" v-action:rule-mgr:add>新建</a-button>
    </div>

    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="state" slot-scope="text">
        <a-tag color="#87d068" v-if="text === 'started'">{{ text }}</a-tag>
        <a-tag color="#f50" v-else>{{ text }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="edit(record)">查看</a>
        <a-divider type="vertical"/>
        <span v-if="record.state === 'stopped'">
          <a-popconfirm title="确认启动？" @confirm="start(record)" v-action:rule-mgr:save>
            <a>启动</a>
          </a-popconfirm>
          <span v-action:rule-mgr:delete>
            <a-divider type="vertical"/>
            <a-popconfirm title="确认删除？" @confirm="deleteScene(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </span>
        <a-popconfirm v-else title="确认停止？" @confirm="stop(record)" v-action:rule-mgr:save>
          <a>停止</a>
        </a-popconfirm>
      </span>
    </PageTable>

    <RuleAdd
      ref="modal"
      v-if="openModal"
      :data="currentData"
      @success="handleOk"
      @close="openModal = false"
    ></RuleAdd>

  </a-card>
</template>

<script>
import _ from 'lodash'
import { tableUrl, get, remove, start, stop } from './api.js'
import RuleAdd from './modules/RuleAdd.vue'

export default {
  name: 'SceneList',
  components: {
    RuleAdd
  },
  data () {
    return {
      url: tableUrl,
      // 查询参数
      searchObj: {},
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id', width: 210 },
        { title: '名称', dataIndex: 'name' },
        { title: '状态', dataIndex: 'state', width: 180, scopedSlots: { customRender: 'state' } },
        { title: '创建时间', dataIndex: 'createTime' },
        { title: '操作', minWidth: 210, dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ],
      openModal: false,
      currentData: {}
    }
  },
  mounted () {
    this.search()
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
      this.$refs.tb.search(condition)
    },
    resetSearch () {
      this.searchObj = {}
      this.search()
    },
    handleAdd () {
      this.currentData = {}
      this.openModal = true
    },
    edit (record) {
      get(record.id).then(resp => {
        if (resp.success) {
          this.currentData = _.cloneDeep(resp.result)
          this.openModal = true
        }
      })
    },
    handleOk () {
      this.openModal = false
      // 新增/修改 成功时，重载列表
      this.search()
    },
    start (item) {
      this.spinning = true
      start(item.id).then(resp => {
        if (resp.success) {
           this.$message.success('启动成功')
           this.search()
        } else {
          this.spinning = false
        }
      })
    },
    deleteScene (id) {
      this.spinning = true
      remove(id).then((response) => {
        if (response.success) {
          this.$message.success('操作成功')
          this.search()
        } else {
          this.spinning = false
        }
      })
    },
    stop (item) {
      this.spinning = true
      stop(item.id).then((response) => {
        if (response.success) {
          this.$message.success('停止成功')
          this.search()
        } else {
          this.spinning = false
        }
      })
    }
  }
}
</script>
