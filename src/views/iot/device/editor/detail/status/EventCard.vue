<template>
  <ChartCard :bordered="false" :title="item.name" :contentHeight="46">
    <a href="#" slot="extra">
      <a-icon type="sync" />
    </a>
    <div slot="total">{{ formatValue }}次</div>
    <span>
      <a-badge v-if="item.expands.level === 'ordinary'" status="processing" text="普通"/>
      <a-badge v-if="item.expands.level === 'warn'" status="warning" text="警告"/>
      <a-badge v-if="item.expands.level === 'urgent'" status="error" text="紧急"/>
    </span>
  </ChartCard>
</template>

<script>
// import _ from 'lodash'
import ChartCard from '@/components/Charts/ChartCard.vue'
import { queryEvent } from '@/views/iot/device/api.js'
export default {
  name: 'EventCard',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          name: '',
          expands: {
              readOnly: null
          },
          id: '',
          type: '',
          unit: '',
          list: [],
          formatValue: null,
          value: null,
          visitData: null
        }
      }
    },
    device: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    ChartCard
  },
  data () {
    return {
      formatValue: 0
    }
  },
  mounted () {
    this.getValue()
  },
  methods: {
    inc () {
      this.formatValue++
    },
    getValue () {
      queryEvent(this.device.id, this.item.id, { pageNum: 1, pageSize: 1 })
      .then(resp => {
        if (resp.success) {
          this.formatValue = resp.result.totalCount
        }
      })
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
