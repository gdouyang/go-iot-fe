<template>
  <div>
    <a-card :bordered="false">
      <div>
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          <a-row :gutter="{ md: 8, lg: 4, xl: 48 }">
            <a-col :md="8" :sm="24">
              <a-form-item label="事件">
                <a-select v-model="eventId" @change="onEventIdChange">
                  <a-select-option
                    v-for="(item, index) in events"
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
                  <a-button icon="search" type="primary" @click="search">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }" @click="resetSearch">
                    重置
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <PageTable ref="tb" :columns="columns" :url="tableUrl" v-if="tableUrl">
      </PageTable>
    </a-card>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { getDeviceEventsUrl } from '@/views/iot/device/api.js'
export default {
  name: 'Events',
  props: {
    device: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      tableUrl: '',
      columns: [],
      searchParams: {
        createTime: []
      },
      events: [],
      eventId: ''
    }
  },
  mounted () {
    const metadata = JSON.parse(this.device.metadata)
    this.events = metadata.events
    if (_.isEmpty(this.events)) {
      return
    }
    this.eventId = this.events[0].id
    this.onEventIdChange()
  },
  methods: {
    onEventIdChange () {
      this.tableUrl = getDeviceEventsUrl(this.device.id, this.eventId)
      const event = _.find(this.events, (ev) => ev.id === this.eventId)
      const columns = []
      if (event) {
        if (event.type === 'object') {
          _.forEach(event.properties, prop => {
            columns.push({ dataIndex: prop.id, title: prop.name })
          })
        } else {
          columns.push({ dataIndex: event.id, title: event.name })
        }
      }
      columns.push({ dataIndex: 'createTime', title: '时间' })
      this.columns = columns
      this.$nextTick(() => {
        this.resetSearch()
      })
    },
    search () {
      const params = []
      if (!_.isEmpty(this.searchParams.createTime)) {
        const formatDate = this.searchParams.createTime.map((e) => moment(e).format('YYYY-MM-DD HH:mm:ss'))
        params.push({ key: 'createTime', oper: 'BTW', value: formatDate.join(',') })
      }
      this.$refs.tb.search(params)
    },
    resetSearch () {
      this.searchParams = {
        createTime: []
      }
      this.search()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
