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
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd" v-action:role-mgr:add>新建</a-button>
    </div>

    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-action:role-mgr:save>编辑</a>
        <span v-action:role-mgr:delete>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </span>
    </PageTable>

    <role-modal ref="modal" @ok="handleOk"></role-modal>

  </a-card>
</template>

<script>
import { roleTableUrl, removeRole } from './api.js'
import RoleModal from './modules/RoleModal'

export default {
  name: 'RoleList',
  components: {
    RoleModal
  },
  data () {
    return {
      url: roleTableUrl,
      // 查询参数
      searchObj: {},
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id', width: '150px' },
        { title: '角色名称', dataIndex: 'name' },
        { title: '描述', dataIndex: 'desc' },
        { title: '创建时间', dataIndex: 'createTime' },
        { title: '操作', minWidth: '210px', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ]
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
      removeRole(row.id).then(data => {
        if (data.success) {
          _this.$message.success('操作成功')
          _this.handleOk()
        }
      })
    }
  }
}
</script>
