<template>
  <div>
    <a-card :bordered="false" :style="{marginBottom: '20px'}">
      <a-descriptions :style="{marginBottom: 20}" bordered :column="2" size="small">
        <span slot="title">
          产品信息
          <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="openBasicInfo">编辑</a-button>
        </span>
        <a-descriptions-item label="产品ID" :span="1">{{ data.id }}</a-descriptions-item>
        <a-descriptions-item label="说明" :span="3">{{ data.desc }}</a-descriptions-item>
      </a-descriptions>
      <Network
        v-if="data.id"
        :product="data"></Network>
      <div style="width: 100%;margin-top: 10px;">
        <a-descriptions :style="{marginBottom: 20}" size="small">
          <span slot="title">
            配置
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="updateVisibleAdd = true;">添加</a-button>
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="updateVisible = true;" v-if="configuration.length > 0">编辑</a-button>
          </span>
        </a-descriptions>

        <div :style="{marginBottom: '20px'}" v-for="(item,index) in configuration" :key="'configuration' + index">
          <h3>{{ item.name }}</h3>
          <a-descriptions bordered :column="2" title="" size="small">
            <a-descriptions-item v-for="(property, inx) in item.properties" :key="property.property + inx">
              <span slot="label">
                <span>{{ property.name }}
                  <a-tooltip :title="property.description">
                    <a-icon type="question-circle-o"/>
                  </a-tooltip>
                </span>
              </span>
              <span v-if="property.type && property.type.type == 'password' && data.configuration[property.property]">••••••</span>
              <span v-else>{{ data.configuration[property.property] }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-card>

    <ProductAdd ref="ProductAdd" @success="refresh()" v-if="addVisible" />

    <Configuration
      v-if="updateVisible"
      :data="data"
      :configuration="configuration"
      @close="() => {
        updateVisible = false
        refresh()
      }"
      @save="updateData"/>
    <ConfigurationAdd
      v-if="updateVisibleAdd"
      :data="data"
      :all-config="configuration"
      @close="() => {
        updateVisibleAdd = false
        refresh()
      }"/>
  </div>
</template>

<script>
// import moment from 'moment'
// import _ from 'lodash'
import ProductAdd from '../modules/product-add.vue'
import Configuration from './configuration.vue'
import ConfigurationAdd from './configurationAdd.vue'
import Network from './Network.vue'

export default {
  name: 'InsEditorDetail',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ProductAdd,
    Configuration,
    ConfigurationAdd,
    Network
  },
  data () {
    return {
      configuration: [],
      addVisible: false,
      updateVisible: false,
      updateVisibleAdd: false
    }
  },
  created () {
    this.GetData()
  },
  computed: {
  },
  methods: {
    GetData () {
      // const { id } = this.data
      // this.getConfiguration(id).then(data => {
      //   if (data.success) {
      //     this.configuration = data.result || []
      //   }
      // })
    },
    getConfiguration (id) {
      return this.$http.get(`/product/${id}/config-metadata`)
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
    },
    updateData (item) {
      // const list = _.filter(this.configuration, c => c.name !== item.name)
      // list.push(item)
      const param = {
        configuration: item.configuration
      }
      this.updateVisible = false
      this.$http.put(`/product/${this.data.id}`, param)
      .then((response) => {
        if (response.success) {
          this.$message.success('配置信息修改成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
