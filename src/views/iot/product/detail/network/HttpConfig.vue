<template>
  <div>
    <a-descriptions bordered :column="2" size="small">
      <span slot="title">
        Http网络配置
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openAdd">编辑</a-button>
      </span>
      <a-descriptions-item label="开启SSL" :span="1">{{ data.configuration.useTLS ? '是' : '否' }}</a-descriptions-item>
      <a-descriptions-item label="连接地址" :span="1">
        <div v-for="a in accessAddress" :key="a">{{ a }}</div>
      </a-descriptions-item>
    </a-descriptions>
    <HttpConfigAdd ref="HttpConfigAdd" @success="getData"/>
  </div>
</template>

<script>
// import moment from 'moment'
import HttpConfigAdd from './HttpConfigAdd.vue'
import { defaultHttpAddObj } from './entity.js'
import _ from 'lodash'
import Base from './base.vue'

export default {
  name: 'MqttConfig',
  props: {
    productId: {
      type: String,
      default: null
    }
  },
  mixins: [ Base ],
  components: {
    HttpConfigAdd
  },
  data () {
    return {
      data: _.cloneDeep(defaultHttpAddObj)
    }
  },
  created () {
    this.getData()
  },
  computed: {
    accessAddress () {
      const port = _.get(this.data, 'port', '')
      if (!port) {
        return ''
      }
      const ssl = _.get(this.data, 'configuration.useTLS', false)
      const address = (ssl ? 'https://' : 'http://') + this.accessIp + ':' + port
      const routers = _.get(this.data, 'configuration.routers', [])
      if (!_.isEmpty(routers)) {
        const arr = []
        _.forEach(routers, r => {
          arr.push(address + r.url)
        })
        return arr
      }
      return [ address ]
    }
  },
  methods: {
    getData () {
      this.getNetwork(this.productId, defaultHttpAddObj)
      .then(data => {
        this.data = data
      })
    },
    openAdd () {
      this.$refs.HttpConfigAdd.open(this.productId)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
