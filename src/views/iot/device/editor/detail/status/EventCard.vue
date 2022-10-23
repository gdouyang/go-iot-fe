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
          valueType: {
              type: '',
              unit: ''
          },
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
    getValue () {
      this.$http.get(`/device-instance/${ this.device.id }/event/${ this.item.id }?format=true&pageSize=1`)
      .then(resp => {
        if (resp.success) {
          this.formatValue = resp.result.total
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
