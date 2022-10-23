<script>
// import _ from 'lodash'
// import moment from 'moment'
import encodeQueryParam from '@/utils/encodeParam.js'
export default {
  name: 'AlamrListMix',
  props: {
  },
  components: {
  },
  created () {
  },
  data () {
    return {
      columns: [{
        title: '设备ID',
        dataIndex: 'deviceId'
      },
      {
        title: '设备名称',
        dataIndex: 'deviceName'
      },
      {
        title: '告警名称',
        dataIndex: 'alarmName'
      },
      {
        title: '告警时间',
        dataIndex: 'alarmTime',
        width: '300px',
        scopedSlots: { customRender: 'createTime' }
      },
      {
        title: '处理状态',
        dataIndex: 'state',
        align: 'center',
        width: '100px',
        scopedSlots: { customRender: 'state' }
      },
      {
        title: '操作',
        width: '120px',
        align: 'center',
        scopedSlots: { customRender: 'action' }
      }],
      alarmLogId: null,
      searchParam: {
        terms: {}
      },
      currentLog: {
        id: null,
        description: null
      }
    }
  },
  methods: {
    detail (record) {
      let content = null
      try {
        content = JSON.stringify(record.alarmData, null, 2)
      } catch (error) {
        content = record.alarmData
      }
      this.$confirm({
        width: '40VW',
        title: '告警数据',
        content: (
          <pre>{content}
          {record.state === 'solve' && (
            <div>
              <br/><br/>
              <span style="font-size: 16px;">处理结果：</span>
              <br/>
              <p>{record.description}</p>
            </div>
          )}
          </pre>
        ),
        okText: '确定',
        cancelText: '关闭'
      })
    },
    edit (record) {
      this.currentLog.id = record.id
      this.currentLog.description = null
      this.$refs.dialog.open()
    },
    findAlarmLog () {
      this.$refs.tb.search(encodeQueryParam(this.searchParam))
    },
    submitData () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const id = this.currentLog.id
          const description = this.currentLog.description
          this.$http.put(`/device/alarm/history/${id}/_solve`, description, {
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
          })
          .then((response) => {
            if (response.success) {
              this.$message.success('保存成功')
              this.findAlarmLog()
              this.$refs.dialog.close()
            }
          })
        }
      })
    }
  }
}
</script>
