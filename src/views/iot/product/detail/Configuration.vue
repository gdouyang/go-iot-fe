<template>
  <div style="width: 100%;margin-top: 10px;">
    <a-descriptions :style="{marginBottom: 20}" size="small">
      <span slot="title">
        配置
        <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="addConfig">添加</a-button>
      </span>
    </a-descriptions>

    <div :style="{marginBottom: '20px'}">
      <a-descriptions bordered :column="1" title="" size="small">
        <a-descriptions-item v-for="(item, index) in configuration" :key="index">
          <span slot="label">
            <a-tooltip :title="item.desc">
              <span>
                {{ item.property }}
              </span>
            </a-tooltip>
            <a-button icon="edit" :style="{marginLeft: 20}" type="link" @click="modifyConfig(item)"></a-button>
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
        $emit('refresh')
      }"/>
  </div>
</template>

<script>
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
    addConfig () {
      this.currentConfig = null
      this.updateVisibleAdd = true
    },
    modifyConfig (data) {
      this.currentConfig = data
      this.updateVisibleAdd = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
