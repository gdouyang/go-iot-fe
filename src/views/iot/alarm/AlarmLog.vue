<template>
  <a-card :bordered="false">
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
          prop="description"
          label="处理结果"
          :rules="[
            {required: true, message: '请输入处理结果'},
            {max: 2000, message: '处理结果不超过2000个字符'}
          ]"
        >
          <a-textarea :rows="8" v-model="currentLog.description" placeholder="请输入处理结果"/>
        </a-form-model-item>
      </a-form-model>
    </Dialog>
  </a-card>
</template>
<script>
// import _ from 'lodash'
// import moment from 'moment'
import AlarmListMix from './alarm-list-mix.vue'
export default {
  name: 'AlamrLog',
  mixins: [ AlarmListMix ],
  props: {
    target: {
      type: String,
      default: null
    },
    targetId: {
      type: String,
      default: null
    }
  },
  components: {
  },
  created () {
    const alarmLogId = this.alarmLogId
    const searchParam = this.searchParam
    if (this.target === 'device') {
      searchParam.deviceId = this.targetId
      if (alarmLogId) {
        searchParam.alarmId = alarmLogId
      }
    } else {
      searchParam.productId = this.targetId
      if (alarmLogId) {
        searchParam.alarmId = alarmLogId
      }
    }
    this.$nextTick(() => {
      this.findAlarmLog()
    })
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
