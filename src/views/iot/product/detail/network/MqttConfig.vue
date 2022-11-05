<template>
  <div>
    <a-descriptions bordered :column="2" size="small">
      <span slot="title">
        MQTT网络配置
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openAdd">编辑</a-button>
      </span>
      <a-descriptions-item label="开启SSL" :span="1">{{ data.configuration.useTLS ? '是' : '否' }}</a-descriptions-item>
      <a-descriptions-item label="连接地址" :span="1">{{ accessAddress }}</a-descriptions-item>
    </a-descriptions>
    <MqttConfigAdd ref="MqttConfigAdd" @success="getData"/>
  </div>
</template>

<script>
// import moment from 'moment'
import MqttConfigAdd from './MqttConfigAdd.vue'
import { defaultMqttAddObj } from './entity.js'
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
    MqttConfigAdd
  },
  data () {
    return {
      data: _.cloneDeep(defaultMqttAddObj)
    }
  },
  created () {
    this.getData()
  },
  computed: {
  },
  methods: {
    getData () {
      this.getNetwork(this.productId, defaultMqttAddObj)
      .then(data => {
        this.data = data
      })
    },
    openAdd () {
      this.$refs.MqttConfigAdd.open(this.productId)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
