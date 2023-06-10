<template>
  <div>
    <a-card :bordered="false">
      <div>
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          <a-row :gutter="{ md: 8, lg: 4, xl: 48 }">
            <a-col :md="8" :sm="24">
              <a-form-item label="日志类型">
                <a-select mode="multiple" v-model="searchParams.type">
                  <a-select-option
                    v-for="(item, index) in selectOptions"
                    :key="index"
                    :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-form-item label="日期">
                <a-range-picker
                  v-model="searchParams.createTime"
                  :show-time="{ format: 'HH:mm' }"
                  :format="'YYYY-MM-DD HH:mm'"
                  :placeholder="['开始时间', '结束时间']"
                  @change="(date) => searchParams.createTime = date"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <div :style="{ overflow: 'hidden' }">
                <div :style="{ float: 'right', marginBottom: '24px' }">
                  <a-button
                    icon="search"
                    type="primary"
                    @click="search"
                  >
                    查询
                  </a-button>
                  <a-button
                    :style="{ marginLeft: '8px' }"
                    @click="resetSearch"
                  >
                    重置
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <PageTable
        ref="tb"
        :loading="false"
        :columns="columns"
        :url="tableUrl"
        method="post"
      >
        <span slot="action" slot-scope="text">
          <a size="small" @click="showDetail(text)">查看</a>
        </span>
      </PageTable>
    </a-card>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { getDeviceLogsUrl } from '@/views/iot/device/api.js'
export default {
  name: 'DeviceLog',
  props: {
    deviceId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      tableUrl: '',
      selectOptions: [
        // { id: 'event', name: '事件上报' },
        // { id: 'readProperty', name: '属性读取' },
        // { id: 'writeProperty', name: '属性修改' },
        // { id: 'reportProperty', name: '属性上报' },
        { id: 'call', name: '调用' },
        { id: 'reply', name: '回复' },
        { id: 'offline', name: '下线' },
        { id: 'online', name: '上线' }
        // { id: 'other', name: '其它' }
      ],
      columns: [
        { dataIndex: 'type', title: '类型', width: '120px' },
        { dataIndex: 'createTime', title: '时间', width: '300px' },
        { dataIndex: 'content', title: '内容', ellipsis: true },
        { title: '操作', width: '200px', align: 'center', scopedSlots: { customRender: 'action' } }
      ],
      searchParams: {
        type: [],
        createTime: []
      }
    }
  },
  created () {
    this.tableUrl = getDeviceLogsUrl(this.deviceId)
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      const params = []
      if (!_.isEmpty(this.searchParams.createTime)) {
        const formatDate = this.searchParams.createTime.map((e) => moment(e).format('YYYY-MM-DD HH:mm:ss'))
        params.push({ key: 'createTime', oper: 'BTW', value: formatDate.join(',') })
      }
      if (!_.isEmpty(this.searchParams.type)) {
        params.push({ key: 'type', oper: 'IN', value: this.searchParams.type })
      }
      this.$refs.tb.search(params)
    },
    resetSearch () {
      this.searchParams = {
        type: [],
        createTime: []
      }
      this.search()
    },
    showDetail (record) {
      let content = null
      try {
        content = JSON.stringify(JSON.parse(record.content), null, 2)
      } catch (error) {
        content = record.content
      }
      this.$confirm({
        width: '50VW',
        title: '详细信息',
        content: (<pre>{ content }</pre>),
        okText: '确定',
        cancelText: '关闭'
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
