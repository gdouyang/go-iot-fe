<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose">
    <PageTable ref="tb" :url="url" :columns="columns">
      <span slot="notifyTime" slot-scope="text">
        {{ text ? $moment(text).format('YYYY-MM-DD HH:mm:ss') : '/' }}
      </span>
      <span slot="state" slot-scope="text, record">
        <a-tag :color="colorMap.get(text.value)">{{ text.text }}</a-tag>
        <a v-if="text.value === 'error'" @click="showError(record)">查看</a>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showDetail(record)">查看数据</a>
      </span>
    </PageTable>
  </Dialog>
</template>

<script>
import _ from 'lodash'
import { historyTableUrl } from '@/views/notice/api.js'
const defaultAddObj = {
  id: null,
  name: '',
  configuration: {
    properties: []
  }
}
const colorMap = new Map()
colorMap.set('error', '#f50')
colorMap.set('success', '#108ee9')
export default {
  name: 'NoticeHistory',
  data () {
    return {
      url: historyTableUrl,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      addObj: _.cloneDeep(defaultAddObj),
      colorMap: colorMap,
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '时间', dataIndex: 'notifyTime', scopedSlots: { customRender: 'notifyTime' } },
        { dataIndex: 'state', title: '状态', scopedSlots: { customRender: 'state' } },
        { title: '操作', width: '150px', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  created () {},
  methods: {
    open (id) {
      this.$refs.addModal.open({ title: '通知记录' })
      this.$nextTick(() => {
        this.$refs.tb.search([{ key: 'notifierId', value: id }])
      })
    },
    addClose () {
    },
    addConfirm () {
      this.$refs.addModal.close()
    },
    showError (item) {
      this.$confirm({
        width: '40VW',
        title: '错误信息',
        content: (
          <a-textarea value={JSON.stringify(item.errorStack || '{}')} row={10} style={{ height: '200px' }}/>
        ),
        okText: '确定',
        cancelText: '关闭'
      })
    },
    showDetail (item) {
      this.$confirm({
        width: '40VW',
        title: '详情',
        content: (
          <a-textarea value={JSON.stringify(item.context || '{}')} row={4} style={{ height: '200px' }}/>
        ),
        okText: '确定',
        cancelText: '关闭'
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
