<template>
  <div>
    <a-card :bordered="false">
      <div>
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          <a-row :gutter="{ md: 8, lg: 4, xl: 48 }">
            <a-col :md="8" :sm="24">
              <a-form-item label="日志类型">
                <a-select mode="multiple" v-model="searchParams.type$IN">
                  <a-select-option
                    v-for="(item, index) in SelectOptions"
                    :value="item.id"
                    :key="'SelectOptions'+index">{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-form-item label="日期">
                <a-range-picker
                  v-model="searchParams.createTime$BTW"
                  :show-time="{ format: 'HH:mm' }"
                  :format="'YYYY-MM-DD HH:mm'"
                  :placeholder="['开始时间', '结束时间']"
                  @change="(date) => searchParams.createTime$BTW = date"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <div :style="{ overflow: 'hidden' }">
                <div :style="{ float: 'right', marginBottom: '24px' }">
                  <a-button
                    icon="search"
                    type="primary"
                    @click="onSearch"
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
        :url="`/device/${deviceId}/logs`"
        method="get"
        :resultProcess="tableResultProcess"
        rowKey="id"
      >
      </PageTable>
    </a-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import { encodeQueryParamGet } from '@/utils/encodeParam.js'
  export default {
    name: 'DeviceLog',
    props: {
      deviceId: {
        type: String,
        default: null
      }
    },
    data () {
      const columns = [
        {
          dataIndex: 'type.text',
          title: '类型'
        },
        {
          dataIndex: 'timestamp',
          title: '时间',
          defaultSortOrder: 'descend',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          dataIndex: 'content',
          title: '内容',
          ellipsis: true
        },
        {
          dataIndex: 'a-select-option',
          title: '操作',
          width: '250px',
          align: 'center',
          customRender: (text, record) => {
            let content = ''
            try {
              content = JSON.stringify(JSON.parse(record.content), null, 2)
            } catch (error) {
              // eslint-disable-next-line prefer-destructuring
              content = record.content
            }
            return (
              <div>
                <a
                  onClick={() =>
                    this.$confirm({
                      width: '50VW',
                      title: '详细信息',
                      content: <pre>{content}</pre>,
                      okText: '确定',
                      cancelText: '关闭'
                    })
                  }
                >
                  查看
                </a>
              </div>
            )
          }
        }
      ]
      return {
        SelectOptions: [
          { id: 'event', name: '事件上报' },
          { id: 'readProperty', name: '属性读取' },
          { id: 'writeProperty', name: '属性修改' },
          { id: 'reportProperty', name: '属性上报' },
          { id: 'call', name: '调用' },
          { id: 'reply', name: '回复' },
          { id: 'offline', name: '下线' },
          { id: 'online', name: '上线' },
          { id: 'other', name: '其它' }
        ],
        columns,
        searchParams: {
          type$IN: [],
          createTime$BTW: []
        }
      }
    },
    mounted () {
      this.onSearch()
    },
    methods: {
      tableResultProcess (result) {
        result.pageNum = result.pageIndex + 1
        result.list = result.data
      },
      onSearch () {
        // eslint-disable-next-line no-shadow
        const params = { ...this.searchParams, deviceId: this.deviceId }
        if (params.createTime$BTW) {
          const formatDate = params.createTime$BTW.map((e) => moment(e).format('YYYY-MM-DD HH:mm:ss'))
          params.createTime$BTW = formatDate.join(',')
        }
        if (params.type$IN) {
          params.type$IN = params.type$IN.join(',')
        }
        this.search(params)
      },
      search (params) {
        this.$refs.tb.search(params, (p) => {
          p.terms = p.condition
          delete p.condition
          p.pageIndex = p.pageNum - 1
          delete p.pageNum
          p.sorts = {
            field: 'createTime',
            order: 'desc'
          }
          const t = encodeQueryParamGet(p)
          return t
        })
      },
      resetSearch () {
        this.searchParams = {
          type$IN: undefined,
          createTime$BTW: undefined
        }
        const params = { deviceId: this.deviceId }
        this.search(params)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
