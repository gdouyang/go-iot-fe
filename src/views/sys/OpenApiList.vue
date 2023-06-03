<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="searchObj.username" placeholder="请输入"/>
            </a-form-item>
          </a-col>
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
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
    </div>

    <PageTable ref="tb" url="open-api/page" :columns="columns">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a size="small" v-if="record.enableFlag === 0" @click="enable(record)">启用</a>
        <a size="small" v-if="record.enableFlag === 1" @click="disable(record)">禁用</a>
        <a-divider type="vertical" />
        <a @click="remove(record)">删除</a>
      </span>
    </PageTable>

    <OpenApiModal ref="modal" @ok="handleOk" :showTanent="showTanent"></OpenApiModal>

  </a-card>
</template>

<script>
import OpenApiModal from './modules/OpenApiModal'

export default {
  name: 'UserList',
  components: {
    OpenApiModal
  },
  data () {
    return {
      showTanent: false,
      // 查询参数
      searchObj: {},
      // 表头
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: 'clientId', dataIndex: 'username' },
        { title: '名称', dataIndex: 'name' },
        { title: '状态', dataIndex: 'enableFlagI18n' },
        { title: '创建时间', dataIndex: 'createTime' },
        { title: '操作', width: '150px', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      this.searchObj.isTenant = this.showTanent
      this.$refs.tb.search(this.searchObj)
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
    enable (row) {
      this.$confirm({
        title: '确认',
        content: '确定要启用吗？',
        onOk: () => {
          this.$http.put(`open-api/enable/${row.id}`, {})
          .then(data => {
            if (data.success) {
              this.$message.success('操作成功')
              this.handleOk()
            }
          })
        }
      })
    },
    disable (row) {
      this.$confirm({
        title: '确认',
        content: '确定要禁用用吗？',
        onOk: () => {
          this.$http.put(`open-api/disable/${row.id}`, {})
          .then(data => {
            if (data.success) {
              this.$message.success('操作成功')
              this.handleOk()
            }
          })
        }
      })
    },
    remove (row) {
      const _this = this
      this.$confirm({
        title: '确认',
        content: '确定要删除吗？',
        onOk: () => {
          _this.$http.delete(`open-api/${row.id}`)
          .then(data => {
            if (data.success) {
              _this.$message.success('操作成功')
              _this.handleOk()
            }
          })
        }
      })
    }
  }
}
</script>
