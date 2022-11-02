<template>
  <div>
    <a-card :bordered="false" v-show="!GetDetailStatus">
      <div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="设备ID">
                  <a-input v-model="searchObj.id" placeholder="请输入"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="名称">
                  <a-input v-model="searchObj.name" placeholder="请输入"/>
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
          <a-button type="primary" icon="plus" @click="add">新建</a-button>
          <!-- <a-button icon="upload" @click="showImport">
            批量导入设备
          </a-button> -->
        </div>
        <PageTable ref="tb" url="device/page" :columns="columns" rowKey="id">
          <span slot="state" slot-scope="text, record">
            <a-badge status="success" :text="record.state" v-if="record.state == 'online'" />
            <a-badge status="default" :text="record.state" v-else-if="record.state == 'offline'" />
            <a-badge status="default" text="--" v-else />
          </span>
          <span slot="registryTime" slot-scope="text, record">
            {{ $moment(record.registryTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
          <span slot="createTime" slot-scope="text, record">
            {{ $moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
          <span slot="action" slot-scope="text, record">
            <a size="small" @click="detail(record.id)">查看</a>
            <a-divider type="vertical" />
            <a size="small" @click="edit(record)">修改</a>
            <a-divider type="vertical" />
            <a size="small" @click="deploy(record.id)" v-if="record.state.value === 'notActive'">激活</a>
            <a size="small" @click="unDeploy(record.id)" v-else>停用</a>
            <template v-if="record.state.value === 'notActive'">
              <a-divider type="vertical" />
              <a size="small" @click="remove(record)">删除</a>
            </template>
          </span>
        </PageTable>
      </div>
    </a-card>
    <DeviceAdd ref="DeviceAdd" @success="search()" />
    <DeviceImport ref="DeviceImport" @success="search()" />
    <DeviceDetail ref="DeviceDetail" v-if="GetDetailStatus" @back="back" />
  </div>
</template>

<script>
import _ from 'lodash'
import DeviceAdd from './modules/device-add'
import DeviceImport from './modules/device-import'
import DeviceDetail from './editor/index.vue'

const defautSearchObj = {
  username: '',
  name: ''
}
export default {
  components: {
    DeviceAdd,
    DeviceImport,
    DeviceDetail
  },
  data () {
    return {
      searchObj: _.cloneDeep(defautSearchObj),
      columns: [
        { title: '设备ID', dataIndex: 'id' },
        { title: '名称', dataIndex: 'name' },
        { title: '产品', dataIndex: 'productId' },
        { title: '状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
        { title: '注册时间', dataIndex: 'registryTime', scopedSlots: { customRender: 'registryTime' } },
        { title: '创建时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', dataIndex: 'action', minWidth: 110, scopedSlots: { customRender: 'action' } }
      ],
      GetDetailStatus: false
    }
  },
  created () {
    this.$nextTick(() => {
      const deviceId = this.$route.query.id
      if (deviceId) {
        this.detail(deviceId)
      } else {
        this.search()
      }
    })
  },
  methods: {
    search () {
      this.$refs.tb.search(this.searchObj)
    },
    resetSearch () {
      this.searchObj = _.cloneDeep(defautSearchObj)
      this.search()
    },
    add () {
      this.$refs.DeviceAdd.add()
    },
    detail (id) {
      this.$router.push({ name: this.$route.name, query: { id: id } })
      this.GetDetailStatus = true
    },
    back () {
      this.$router.push({ name: this.$route.name, query: {} })
      this.GetDetailStatus = false
      this.search()
    },
    edit (row) {
      this.$refs.DeviceAdd.edit(row)
    },
    deploy (id) {
      this.$http.post(`device/${id}/deploy`)
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    },
    unDeploy (id) {
      this.$http.post(`device/${id}/undeploy`)
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    },
    remove (row) {
      this.$confirm({
        title: '确认',
        content: '确定要删除吗？',
        onOk: () => {
          this.$http.delete(`device/${row.id}`)
            .then((data) => {
              if (data.success) {
                this.$message.success('操作成功')
                this.search()
              }
            })
        }
      })
    },
    showImport () {
      this.$refs.DeviceImport.open()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
