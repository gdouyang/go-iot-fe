<template>
  <Dialog
    ref="dialog"
    title="选择设备"
    @confirm="submitData"
    @close="addClose"
    width="70%"
    :footer="null"
  >
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="编号">
                <a-input v-model="searchObj.code" placeholder="请输入"/>
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
      <PageTable ref="tb" url="device-instance/page" :columns="columns" rowKey="id">
        <span slot="state" slot-scope="text, record">
          {{ record.state && record.state.text }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a size="small" @click="select(record)">选择</a>
        </span>
      </PageTable>
    </div>
  </Dialog>
</template>

<script>
import _ from 'lodash'

const defautSearchObj = {
  username: '',
  name: ''
}
export default {
  components: {
  },
  data () {
    return {
      searchObj: _.cloneDeep(defautSearchObj),
      columns: [
        { title: '编码', dataIndex: 'id' },
        { title: '名称', dataIndex: 'name' },
        { title: '产品', dataIndex: 'productName' },
        { title: '状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
        { title: '操作', dataIndex: 'action', minWidth: 110, scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  created () {
  },
  methods: {
    search () {
      this.$refs.tb.search(this.searchObj)
    },
    resetSearch () {
      this.searchObj = _.cloneDeep(defautSearchObj)
      this.search()
    },
    select (item) {
      this.$emit('select', item)
      this.$refs.dialog.close()
    },
    open () {
      this.$refs.dialog.open()
      this.$nextTick(() => {
        this.search()
      })
    },
    submitData () {

    },
    addClose () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
