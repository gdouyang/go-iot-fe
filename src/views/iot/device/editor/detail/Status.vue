<template>
  <a-spin :spinning="loading">
    <a-row :gutter="24" id="device-status" >
      <a-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="6"
        style="margin-bottom: 24px;"
      >
        <DeviceState :state="device.state" :runInfo="device" />
      </a-col>
      <a-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="6"
        style="margin-bottom: 24px;"
        v-for="item in properties"
        :key="item.id"
      >
        <PropertiesCard :item="item" :device="device" :ref="'propCard' + item.id" />
      </a-col>
      <a-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="6"
        style="margin-bottom: 24px;"
        v-for="item in events"
        :key="item.id"
      >
        <EventCard :item="item" :device="device" />
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
import _ from 'lodash'
import { queryProperty } from '@/views/iot/device/api.js'
import DeviceState from './status/DeviceState.vue'
import PropertiesCard from './status/PropertiesCard.vue'
import EventCard from './status/EventCard.vue'
export default {
  name: 'DeviceStatus',
  components: {
    DeviceState,
    PropertiesCard,
    EventCard
  },
  props: {
    device: {
      type: Object,
      default: () => {}
    },
    realtimeData: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['reloadFuncs'],
  data () {
    return {
      properties: [],
      events: [],
      loading: true
    }
  },
  watch: {
    realtimeData (newVal) {
      const that = this
      _.forEach(this.properties, prop => {
        prop.list.push({
          timeString: newVal.createTime,
          value: newVal[prop.id]
        })

        if (_.size(prop.list) > 20) {
          var list = []
          for (var i = prop.list.length - 20; i < prop.list.length; i++) {
            list.push(prop.list[i])
          }
          prop.list = list
        }
        prop.value = newVal[prop.id]
        that.$refs['propCard' + prop.id][0].getValue()
      })
    }
  },
  mounted () {
    const checkerId = this.checkerId = 'status-' + _.uniqueId()
    this.reloadFuncs.set(checkerId, () => {
      this.propertiesRealTime()
    })
    this.propertiesRealTime()
  },
  beforeDestroy () {
    this.reloadFuncs.delete(this.checkerId)
  },
  methods: {
    propertiesRealTime () {
      const device = this.device
      this.loading = true
      queryProperty(device.id, { }).then(resp => {
        const metadata = JSON.parse(this.device.metadata)
        const properties = _.cloneDeep(metadata.properties)
        this.events = metadata.events
        _.forEach(properties, prop => {
          const list = []
          _.forEach(resp.result.list, item => {
            if (!_.isNil(item[prop.id])) {
              list.push({
                timeString: item.createTime,
                value: item[prop.id]
              })
            }
          })
          prop.list = list.reverse()
        })
        this.properties = properties
      })
      .finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
