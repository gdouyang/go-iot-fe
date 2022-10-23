<template>
  <div>
    <a-card :bordered="false">
      <a-button
        slot="title"
        icon="plus"
        type="primary"
        @click="add"
      >
        新增告警
      </a-button>
      <a-table rowKey="id" :columns="columns" :dataSource="data" :pagination="false">
        <span slot="state" slot-scope="text">
          <a-badge :status="statusMap.get(text.value)" :text="text.text" />
        </span>
        <span slot="createTime" slot-scope="text">
          {{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/' }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="alarmLog(record)">告警日志</a>
          <a-divider type="vertical"/>
          <span v-if="record.state.value === 'stopped'">
            <a-popconfirm
              title="确认启动此告警？"
              @confirm="start(record)"
            >
              <a>启动</a>
            </a-popconfirm>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确认删除此告警？"
              @confirm="deleteAlarm(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
          <a-popconfirm
            v-else
            title="确认停止此告警？"
            @confirm="stop(record)"
          >
            <a>停止</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>

    <Save
      v-if="saveVisible"
      :target="target"
      :targetId="targetId"
      :metaData="metaData"
      :name="name"
      :productId="productId"
      :productName="productName"
      :data="saveAlarmData"
      @save="save"
      @close="close"
    />
  </div>
</template>
<script>
import _ from 'lodash'
import moment from 'moment'
import Save from './save.vue'

const statusMap = new Map()
statusMap.set('running', 'success')
statusMap.set('stopped', 'error')
export default {
  name: 'AlarmSetting',
  props: {
    target: {
      type: String,
      default: null
    },
    targetId: {
      type: String,
      default: null
    },
    metaData: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    productId: {
      type: String,
      default: null
    },
    productName: {
      type: String,
      default: null
    }
  },
  components: {
    Save
  },
  created () {
    this.getProductAlarms()
  },
  data () {
    return {
      moment: moment,
      statusMap: statusMap,
      columns: [
        {
          title: '告警名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '运行状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          width: '250px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      spinning: false,
      data: [],
      saveAlarmData: {},
      saveVisible: false,
      alarmDataList: []
    }
  },
  methods: {
    add () {
      this.saveAlarmData = {}
      this.saveVisible = true
    },
    edit (item) {
      this.saveAlarmData = _.cloneDeep(item)
      this.saveVisible = true
    },
    alarmLog (item) {
      this.$emit('alarm-log', item.id)
    },
    start (item) {
      this.spinning = true
      this.$http.post(`/device/alarm/${item.id}/_start`)
      .then(resp => {
        if (resp.success) {
           this.$message.success('启动成功')
           this.getProductAlarms()
        } else {
          this.spinning = false
        }
      })
    },
    deleteAlarm (id) {
      this.spinning = true
      this.$http.delete(`/device/alarm/${id}`)
      .then((response) => {
        if (response.success) {
          this.$message.success('操作成功')
          this.getProductAlarms()
        } else {
          this.spinning = false
        }
      })
    },
    stop (item) {
      this.spinning = true
      this.$http.post(`/device/alarm/${item.id}/_stop`)
      .then((response) => {
        if (response.success) {
          this.$message.success('停止成功')
          this.getProductAlarms()
        } else {
          this.spinning = false
        }
      })
    },
    getProductAlarms () {
      const alarmDataList = this.alarmDataList
      alarmDataList.splice(0, alarmDataList.length)
      const target = this.target
      const targetId = this.targetId
      this.$http.get(`/device/alarm/${target}/${targetId}`)
      .then(resp => {
        if (resp.success) {
          this.data = resp.result
          _.map(resp.result, item => {
            alarmDataList.push(item)
          })
        }
        this.spinning = false
      })
      if (target === 'device') {
        const productId = this.productId
        this.$http.get(`/device/alarm/product/${productId}`)
        .then(resp => {
          if (resp.success) {
            resp.result.map((item) => {
              alarmDataList.push(item)
            })
          }
        })
      }
    },
    save (data) {
      this.spinning = true
      console.log(data)
      this.submitData(data)
    },
    close () {
      this.saveVisible = false
      this.saveAlarmData = {}
      this.getProductAlarms()
    },
    submitData (data) {
      this.$http.patch(`/device/alarm/${this.target}/${this.targetId}`, data)
      .then((response) => {
        if (response.success) {
          this.$message.success('保存成功')
          this.saveVisible = false
          this.getProductAlarms()
        }
        this.spinning = false
      })
    }
  }
}
</script>
