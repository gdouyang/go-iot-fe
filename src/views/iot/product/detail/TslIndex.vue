<template>
  <a-card :bordered="false" :style="{marginBottom: '20px'}">
    <a-spin :spinning="loading">
      <a-tabs default-active-key="1">
        <template slot="tabBarExtraContent">
          <a-button @click="importTSL" style="margin-right: 5px;">导入物模型</a-button>
          <a-button @click="showTSL">物模型</a-button>
        </template>
        <a-tab-pane key="1" tab="属性定义">
          <Properties :product="product" :data="propertyData" :unitsData="unitsData" @save="saveProperties"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="功能定义">
          <Functions :product="product" :data="functionsData" :unitsData="unitsData" @save="saveFunctions"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="事件定义">
          <Events :data="eventsData" :unitsData="unitsData" @save="saveEvents"/>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <TslImportDialog ref="TslImportDialog" @import="saveAll"/>
  </a-card>
</template>

<script>
// import _ from 'lodash'
import Properties from './tsl/Properties.vue'
import Functions from './tsl/Functions.vue'
import Events from './tsl/Events.vue'
import TslImportDialog from './tsl/TslImportDialog.vue'
export default {
  name: 'TSL',
  components: {
    Properties,
    Functions,
    Events,
    TslImportDialog
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    propertyData: {
      type: [Object, Array],
      default: () => null
    },
    functionsData: {
      type: [Object, Array],
      default: () => null
    },
    eventsData: {
      type: [Object, Array],
      default: () => null
    },
    unitsData: {
      type: [Object, Array],
      default: () => null
    }
  },
  data () {
    return {
      properties: [],
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    saveProperties (data, onlySave) {
      this.$emit('save', 'properties', data, onlySave)
    },
    saveFunctions (data, onlySave) {
      this.$emit('save', 'function', data, onlySave)
    },
    saveEvents (data, onlySave) {
      this.$emit('save', 'event', data, onlySave)
    },
    saveAll (data, onlySave) {
      this.$emit('save', 'all', data, onlySave)
    },
    importTSL () {
      this.$refs.TslImportDialog.open(null, true)
    },
    showTSL () {
      this.$refs.TslImportDialog.open(this.product.metadata)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
