<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="设备ID">
              <a-input v-model="searchObj.deviceId" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="产品ID">
              <a-input v-model="searchObj.productId" placeholder="请输入"/>
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
    <PageTable ref="tb" rowKey="id" :columns="columns" url="/alarm/log/page">
      <span slot="state" slot-scope="text">
        <a-tag color="#87d068" v-if="text === 'solve'">已处理</a-tag>
        <a-tag color="#f50" v-else>未处理</a-tag>
      </span>
      <span slot="createTime" slot-scope="text">
        {{ text ? $moment(text).format('YYYY-MM-DD HH:mm:ss') : '/' }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="detail(record)">详情</a>
        <a-divider type="vertical"/>
        <a @click="edit(record)" v-if="record.state !== 'solve'">处理</a>
      </span>
    </PageTable>

    <Dialog
      title="告警处理结果"
      ref="dialog"
      @confirm="submitData"
    >
      <a-form-model ref="form" :model="currentLog" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
        <a-form-model-item
          prop="desc"
          label="处理结果"
          :rules="[
            {required: true, message: '请输入处理结果'},
            {max: 2000, message: '处理结果不超过2000个字符'}
          ]"
        >
          <a-textarea :rows="8" v-model="currentLog.desc" placeholder="请输入处理结果"/>
        </a-form-model-item>
      </a-form-model>
    </Dialog>
  </a-card>
</template>
<script>
// import _ from 'lodash'
// import moment from 'moment'
import { solveAlarmLog } from './api.js'
// import encodeQueryParam from '@/utils/encodeParam.js'
export default {
  name: 'AlamrList',
  mixins: [ ],
  props: {
  },
  components: {
  },
  created () {
    this.$nextTick(() => {
      this.search()
    })
  },
  data () {
    return {
      searchObj: {
        deviceId: undefined,
        productId: undefined
      },
      columns: [
        { title: '告警名称', dataIndex: 'alarmName' },
        { title: '设备ID', dataIndex: 'deviceId' },
        { title: '产品名称', dataIndex: 'productId' },
        { title: '告警时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '处理状态', dataIndex: 'state', align: 'center', width: '100px', scopedSlots: { customRender: 'state' } },
        { title: '操作', width: '120px', align: 'center', scopedSlots: { customRender: 'action' } }
      ],
      alarmLogId: null,
      currentLog: {
        id: null,
        desc: null
      }
    }
  },
  methods: {
    search () {
      const condition = []
      if (this.searchObj.deviceId) {
        condition.push({ key: 'deviceId', value: this.searchObj.deviceId, oper: 'LIKE' })
      }
      if (this.searchObj.productId) {
        condition.push({ key: 'productId', value: this.searchObj.productId, oper: 'LIKE' })
      }
      this.$refs.tb.search(condition)
    },
    resetSearch () {
      this.searchObj.deviceId = undefined
      this.searchObj.productId = undefined
      this.search()
    },
    detail (record) {
      let content = null
      try {
        content = JSON.stringify(JSON.parse(record.alarmData), null, 2)
      } catch (error) {
        content = record.alarmData
      }
      this.$confirm({
        width: '40VW',
        title: '告警数据',
        content: (
          <div>
            <pre style="padding: 5px; background-color: #efefef;">{ content }</pre>
            {record.state === 'solve' && (
              <div>
                <br/><br/>
                <span style="font-size: 16px;">处理结果：</span>
                <br/>
                <p style="padding: 5px; background-color: #efefef;">{record.desc}</p>
              </div>
            )}
          </div>
        ),
        okText: '确定',
        cancelText: '关闭'
      })
    },
    edit (record) {
      this.currentLog.id = record.id
      this.currentLog.desc = null
      this.$refs.dialog.open()
    },
    submitData () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const id = this.currentLog.id
          solveAlarmLog(id, this.currentLog).then((response) => {
            if (response.success) {
              this.$message.success('保存成功')
              this.search()
              this.$refs.dialog.close()
            }
          })
        }
      })
    }
  }
}
</script>
