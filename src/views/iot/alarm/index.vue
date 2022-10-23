<template>
  <a-spin tip="加载中..." :spinning="spinning">
    <a-card>
      <a-tabs :activeKey="alarmActiveKey" @tabClick="tabClick">
        <a-tab-pane tab="告警设置" key="info">
          <AlarmSetting
            :target="target"
            :targetId="targetId"
            :metaData="metaDataObj"
            :name="name"
            :productId="productId"
            :productName="productName"
          />
        </a-tab-pane>
        <a-tab-pane tab="告警记录" key="logList">
          <AlarmLog
            :target="target"
            :targetId="targetId"
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>
</template>
<script>
import AlarmSetting from './alarm-setting.vue'
import AlarmLog from './alarm-log.vue'
export default {
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
      type: String,
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
    AlarmSetting,
    AlarmLog
  },
  computed: {
    metaDataObj () {
      return this.metaData ? JSON.parse(this.metaData) : {}
    }
  },
  data () {
    return {
      alarmActiveKey: 'info',
      spinning: false
    }
  },
  created () {
  },
  methods: {
    tabClick (key) {
      this.alarmActiveKey = key
    }
  }
}
</script>
