<template>
  <div style="width: 100%;margin-top: 10px;">
    <a-descriptions :style="{marginBottom: 20}" size="small">
      <span slot="title">
        配置
        <a-button icon="plus" :style="{marginLeft: 20}" type="link" @click="addConfig">添加</a-button>
      </span>
    </a-descriptions>

    <div :style="{marginBottom: '20px'}">
      <a-descriptions bordered :column="2" title="" size="small">
        <a-descriptions-item v-for="(item, index) in configuration" :key="index">
          <span slot="label">
            <a-tooltip :title="item.desc">
              <span>
                {{ item.property }}
              </span>
            </a-tooltip>
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="modifyConfig(item)"></a-button>
            <a-popconfirm
              title="确认删除配置？"
              @confirm="deleteConfig(item)">
              <a-button icon="delete" :style="{marginLeft: 20}" type="link"></a-button>
            </a-popconfirm>
          </span>
          <span v-if="item.type && item.type.type == 'password' && item.value">••••••</span>
          <span v-else>{{ item.value }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </div>

    <ConfigurationAdd
      v-if="updateVisibleAdd"
      :productId="productId"
      :all-config="configuration"
      :data="currentConfig"
      @close="() => {
        updateVisibleAdd = false
        refresh()
      }"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { updateProduct } from '@/views/iot/product/api.js'
import ConfigurationAdd from './ConfigurationAdd.vue'
export default {
  name: 'Configuration',
  props: {
    productId: {
      type: String,
      default: () => null
    },
    configuration: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ConfigurationAdd
  },
  data () {
    return {
      updateVisibleAdd: false,
      currentConfig: null
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    addConfig () {
      this.currentConfig = null
      this.updateVisibleAdd = true
    },
    modifyConfig (data) {
      this.currentConfig = data
      this.updateVisibleAdd = true
    },
    deleteConfig (data) {
      const conf = _.filter(this.configuration, p => p.property !== data.property)
      const param = {
        id: this.productId,
        metaconfig: JSON.stringify(conf)
      }
      updateProduct(this.productId, param).then((resp) => {
        if (resp.success) {
          this.$message.success('操作成功')
          this.refresh()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
