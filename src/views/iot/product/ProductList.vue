<template>
  <div>
    <a-card :bordered="false" v-show="!GetDetailStatus">
      <div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
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
        </div>
        <PageTable ref="tb" url="product/page" :columns="columns" rowKey="id">
          <span slot="deviceType" slot-scope="text">
            {{ text.text }}
          </span>
          <span slot="state" slot-scope="text">
            <a-badge :status="text ? 'success' : 'default'" :text="text ? '发布' : '停用'" />
          </span>
          <span slot="action" slot-scope="text, record">
            <a size="small" @click="detail(record.id)">查看</a>
            <a-divider type="vertical" />
            <a size="small" @click="unDeploy(record.id)" v-if="record.state">停用</a>
            <a size="small" @click="deploy(record.id)" v-else>发布</a>
            <template v-if="!record.state">
              <a-divider type="vertical" />
              <a size="small" @click="deleteById(record.id)">删除</a>
            </template>
          </span>
        </PageTable>
      </div>
    </a-card>
    <ProductAdd ref="ProductAdd" @success="search()" />
    <Detail ref="Detail" v-if="GetDetailStatus" @back="back" />
  </div>
</template>

<script>
import _ from 'lodash'
// import moment from 'moment'
import ProductAdd from './modules/product-add.vue'
import Detail from './detail-index.vue'

const defautSearchObj = {
  name: ''
}
export default {
  components: {
    ProductAdd,
    Detail
  },
  data () {
    return {
      searchObj: _.cloneDeep(defautSearchObj),
      columns: [
        { title: '产品ID', dataIndex: 'id' },
        { title: '名称', dataIndex: 'name' },
        { title: '状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
        // { title: '设备类型', dataIndex: 'deviceType', scopedSlots: { customRender: 'deviceType' } },
        // { title: '创建时间', customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss') },
        // { title: '修改时间', dataIndex: 'modifyTime' },
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
      this.$refs.ProductAdd.add()
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
    deploy (id) {
      this.$http.post(`product/${id}/deploy`)
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    },
    unDeploy (id) {
      this.$http.post(`product/${id}/undeploy`)
      .then(data => {
        if (data.success) {
          this.$message.success('操作成功')
          this.search()
        }
      })
    },
    deleteById (id) {
      this.$confirm({
        title: '确认',
        content: '确定要删除吗？',
        onOk: () => {
          this.$http.delete(`product/${id}`)
          .then(data => {
            if (data.success) {
              this.$message.success('操作成功')
              this.search()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
