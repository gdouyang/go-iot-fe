<template>
  <div>
    <a-card :bordered="false" :style="{marginBottom: '20px'}">
      <a-descriptions :style="{marginBottom: 20}" bordered :column="2" size="small">
        <span slot="title">
          产品信息
          <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openBasicInfo">编辑</a-button>
        </span>
        <a-descriptions-item label="产品ID" :span="1">{{ data.id }}</a-descriptions-item>
        <a-descriptions-item label="网络类型" :span="1">{{ data.networkType }}</a-descriptions-item>
        <a-descriptions-item label="说明" :span="2">{{ data.desc }}</a-descriptions-item>
      </a-descriptions>

      <Network
        v-if="data.id"
        :product="data"></Network>

      <Configuration :productId="data.id" :configuration="configuration" @refresh="refresh()"/>
    </a-card>

    <ProductAdd ref="ProductAdd" @success="refresh()" v-if="addVisible" />

  </div>
</template>

<script>
// import moment from 'moment'
// import _ from 'lodash'
import ProductAdd from '../modules/ProductAdd.vue'
import Configuration from './Configuration.vue'
import Network from './Network.vue'

export default {
  name: 'ProductInfo',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ProductAdd,
    Configuration,
    Network
  },
  data () {
    return {
      configuration: [],
      addVisible: false
    }
  },
  created () {
    this.GetData()
  },
  computed: {
  },
  watch: {
    'data.metaconfig' (newVal) {
      this.GetData()
    }
  },
  methods: {
    GetData () {
      const data = this.data
      this.configuration = data.metaconfig ? data.metaconfig : []
    },
    openBasicInfo () {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.ProductAdd.edit(this.data)
      })
    },
    refresh () {
      this.$emit('refresh')
      this.GetData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
