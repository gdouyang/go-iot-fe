<style lang="less">
</style>

<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="900">
    <div></div>
    <PageTable ref="tb" url="project-datapush/log" :columns="columns" size="small">
      <span slot="createTime" slot-scope="text">
        {{ formatTime(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showDetail(record)">查看</a>
      </span>
    </PageTable>
  </Dialog>
</template>

<script>
// import _ from 'lodash'
import moment from 'moment'
export default {
  data () {
    return {
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: '设备',
          dataIndex: 'deviceId',
          width: '120px'
        },
        {
          title: '数据',
          dataIndex: 'data',
          ellipsis: true
        },
        {
          title: '结果',
          dataIndex: 'result',
          ellipsis: true
        },
        {
          title: '时间(秒)',
          dataIndex: 'useTime',
          width: '70px'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '200px',
          scopedSlots: { customRender: 'createTime' }
        }, {
          title: '操作',
          width: '50px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created () {},
  methods: {
    open (row) {
      this.queryParam.terms = [
        { column: 'configId', value: row.id }
      ]
      this.$refs.addModal.open({ title: '推送日志', onopen: this.search })
    },
    search () {
      this.$nextTick(() => {
        this.queryParam.sorts = [
          { name: 'createTime', order: 'desc' }
        ]
        this.$refs.tb.search(this.queryParam)
      })
    },
    formatTime (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss.SSS')
    },
    showDetail (data) {
      let content = null
      try {
        content = JSON.stringify(JSON.parse(data.data), null, 2)
      } catch (error) {
        content = data.data
      }
      this.$info({
        width: '40VW',
        title: '推送数据',
        content: (
          <pre>{content}</pre>
        ),
        okText: '确定',
        cancelText: '关闭'
      })
    },
    addClose () {
    },
    addConfirm () {
      this.$refs.addModal.close()
    }
  }
}
</script>
