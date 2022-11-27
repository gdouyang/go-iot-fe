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

    <PageTable ref="tb" url="/rule/page" :columns="columns">
      <span slot="state" slot-scope="text">
        {{ text }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="edit(record)">查看</a>
        <a-divider type="vertical"/>
        <span v-if="record.state === 'stopped'">
          <a-popconfirm
            title="确认启动？"
            @confirm="start(record)"
          >
            <a>启动</a>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="确认删除？"
            @confirm="deleteScene(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
        <a-popconfirm
          v-else
          title="确认停止？"
          @confirm="stop(record)"
        >
          <a>停止</a>
        </a-popconfirm>
      </span>
    </PageTable>

    <SceneAdd
      ref="modal"
      v-if="openModal"
      :data="currentData"
      @success="handleOk"
      @close="openModal = false"
    ></SceneAdd>

  </a-card>
</template>

<script>
import _ from 'lodash'
import { get, remove, start, stop } from './api.js'
import SceneAdd from './modules/SceneAdd.vue'

export default {
  name: 'SceneList',
  components: {
    SceneAdd
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '名称', dataIndex: 'name' },
        { title: '创建时间', dataIndex: 'createTime', minWidth: 110 },
        { title: '状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
        {
          title: '操作',
          minWidth: 110,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
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
      this.$refs.tb.search(this.queryParam)
    },
    resetSearch () {
      this.queryParam = {}
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
