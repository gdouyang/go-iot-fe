<template>
  <ChartCard :bordered="false" title="设备状态" :contentHeight="46" :total="state.text">
    <!-- <a href="#" slot="action">
      <a-icon type="sync" />
    </a> -->
    <span v-if="state === 'online'">上线时间：{{ GetTime(runInfo.onlineTime) }}</span>
    <span v-else>离线时间：{{ GetTime(runInfo.onlineTime) }}</span>
  </ChartCard>
</template>

<script>
import ChartCard from '@/components/Charts/ChartCard'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
export default {
  name: 'DeviceState',
  props: {
    state: {
      type: Object,
      default: () => ''
    },
    runInfo: {
      type: Object,
      default: () => { return { onlineTime: '', offlineTime: '' } }
    }
  },
  components: {
    ChartCard
  },
  methods: {
    GetTime (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
.card-value {
  color: rgba(0,0,0,.85);
  font-size: 30px;
  overflow: hidden;
  line-height: 38px;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>
