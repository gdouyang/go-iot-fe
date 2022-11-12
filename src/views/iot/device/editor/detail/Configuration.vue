<template>
  <a-drawer title="编辑配置" width="500" visible :afterVisibleChange="visibleChange" @close="visibleChange(false)">
    <div :style="{marginBottom: '20px'}" v-for="(item,index) in configuration" :key="'configuration' + index">
      <h3>{{ item.name }}</h3>
      <a-form-model :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
        <a-row :gutter="16">
          <a-col v-for="(property, inx) in item.properties" :key="property.property + inx">
            <h4>{{ item.configName }}</h4>
            <a-form-item>
              <span slot="label">
                <span>{{ property.name }}</span>
                <a-tooltip :title="property.description">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <span v-if="property.type">
                <a-input-password v-if=" property.type.type === 'password'" v-model="cData.configuration[property.property]"/>
                <a-input v-else v-model="cData.configuration[property.property]"/>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="demo-drawer-footer">
      <a-button style="margin-right: 8px" @click="visibleChange(false)">关闭</a-button>
      <a-button type="primary" @click="saveData">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'Configuration',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    configuration: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    visible (newVal) {
      this.openFlag = newVal
    }
  },
  data () {
    return {
      openFlag: false,
      cData: {
        configuration: {}
      }
    }
  },
  methods: {
    parseConfig (configData) {
      const cData = { configuration: {} }
      configData.forEach(i => {
        i.properties.forEach((item) => {
          cData.configuration[item.property] = this.data.configuration[item.property]
        })
      })
      this.cData = cData
    },
    visibleChange (flag) {
      if (!flag) {
        this.$emit('close')
      } else {
        this.parseConfig(this.configuration)
      }
    },
    saveData () {
      this.$emit('save', this.cData)
    }
  }
}
</script>

<style lang="less" scoped>
.demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
