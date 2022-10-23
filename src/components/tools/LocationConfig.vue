<template>
  <Dialog ref="addModal" @confirm="addConfirm" @close="addClose" :width="800">
    <baidu-map
      class="map"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      :mapClick="false"
      @ready="handler"
      @click="mapClick"
      ak="g5IoseVn5ZlLawf4cL5lTyIfZb9y6GOQ">
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
    </baidu-map>
    <span>经度: {{ addObj.longitude }}</span>
    <span>纬度: {{ addObj.latitude }}</span>
  </Dialog>
</template>

<script>
import _ from 'lodash'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
const defaultAddObj = {
  longitude: null, // 经度
  latitude: null // 纬度
}
export default {
  name: 'LocationConfig',
  components: {
    BaiduMap,
    BmGeolocation,
    BmMarker
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      addObj: _.cloneDeep(defaultAddObj),
      showMap: false,
      zoom: 15
    }
  },
  created () {},
  methods: {
    open (row) {
      this.addObj.longitude = row.longitude
      this.addObj.latitude = row.latitude
      this.showMap = true
      this.$refs.addModal.open({ title: '位置' })
      this.addMarker(true)
    },
    close () {
      this.$refs.addModal.close()
    },
    handler ({ BMap, map }) {
      console.log(BMap, map)
      this.map = map
      const success = this.addMarker(true)
      if (!success) {
        var myCity = new BMap.LocalCity()
        myCity.get((result) => {
          var cityName = result.name
          map.setCenter(cityName)
        })
      }
      // this.center.lng = this.addObj.longitude || 116.404
      // this.center.lat = this.addObj.latitude || 39.915
      this.zoom = 15
    },
    mapClick ({ type, target, point, pixel, overlay }) {
      this.addObj.longitude = _.toString(point.lng).substr(0, 11)
      this.addObj.latitude = _.toString(point.lat).substr(0, 11)
      this.addMarker()
    },
    addMarker (cneter) {
      const row = this.addObj
      const map = this.map
      if (map && row.longitude && row.latitude) {
        if (this.marker) {
          map.removeOverlay(this.marker)
        }
        var point = new window.BMap.Point(row.longitude, row.latitude)
        var marker = this.marker = new window.BMap.Marker(point)
        if (cneter) {
          setTimeout(() => {
            map.setCenter(point)
          }, 100)
        }
        map.addOverlay(marker)
        // this.map.reset()
        return true
      }
      return false
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
    },
    addConfirm () {
      if (!this.addObj.longitude || !this.addObj.latitude) {
        this.$message.error('请点击地图选择位置')
        return
      }
      this.$emit('success', this.addObj)
    }
  }
}
</script>
<style lang="less" scoped>
.map {
  width: 100%;
  height: 350px;
}
</style>
