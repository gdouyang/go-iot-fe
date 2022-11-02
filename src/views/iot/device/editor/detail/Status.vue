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
        <PropertiesCard :item="item" :device="device" />
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
      const list = [{
          'dashboard': 'device',
          'object': device.productId,
          'measurement': 'properties',
          'dimension': 'history',
          'params': {
              'deviceId': device.id,
              'history': 15
          }
      }]
      this.loading = true
      this.$http.post('/dashboard/_multi', list)
      .then(resp => {
        const metadata = JSON.parse(this.device.metadata)
        const properties = _.cloneDeep(metadata.properties)
        this.events = metadata.events
        const data = resp.result
        const mapdata = _.map(data, item => {
          return {
            timeString: item.data.timeString,
            timestamp: item.data.timestamp,
            ...item.data.value
          }
        })
        const group = _.groupBy(mapdata, 'property')
        _.forIn(group, (arr, key) => {
          const newdata = {
            list: arr.sort((a, b) => a.timestamp - b.timestamp),
            property: arr[0].property
          }
          const index = properties.findIndex(item => item.id === newdata.property)
          if (index > -1) {
              properties[index].list = newdata.list
          }
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
