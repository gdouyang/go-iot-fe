<template>
  <a-drawer title="自定义配置" width="500" visible :afterVisibleChange="visibleChange" @close="visibleChange(false)">
    <!-- <h3>{{ configuration.name }}</h3> -->
    <a-form-model :labelCol="{ span: 3 }" :wrapperCol="{ span: 16 }" ref="addFormRef" :model="configuration">
      <a-row :gutter="16" v-for="(property, inx) in configuration.properties" :key="property.property + inx">
        <a-col>
          <a-form-model-item
            :prop="'properties.' + inx + '.name'"
            label="Key"
            :rules="[
              { required: true, message: 'Key不能为空', trigger: 'blur' }
            ]"
          >
            <a-input v-model="property.name" :maxLength="32"></a-input>
          </a-form-model-item>
          <a-form-model-item
            :prop="'properties.' + inx + '.type'"
            label="类型"
            :rules="[
              { required: true, message: '类型不能为空', trigger: 'change' }
            ]"
          >
            <a-select
              v-model="property.type"
            >
              <a-select-option value="string">字符串</a-select-option>
              <a-select-option value="password">密码</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-input v-model="property.description" :maxLength="100"></a-input>
          </a-form-model-item>
        </a-col>
        <a-divider />
      </a-row>
    </a-form-model>
    <div class="drawer-footer">
      <a-button style="margin-right: 8px" @click="visibleChange(false)">关闭</a-button>
      <a-button type="primary" @click="saveData">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import _ from 'lodash'
const defaultData = {
  name: '自定义配置',
  properties: [
    { property: '', name: '', description: '', scopes: [], type: null }
  ]
}
export default {
  name: 'ConfigurationAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    allConfig: {
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
      configuration: _.cloneDeep(defaultData)
    }
  },
  methods: {
    visibleChange (flag) {
      if (!flag) {
        this.$emit('close')
      } else {
        this.configuration = _.cloneDeep(defaultData)
      }
    },
    saveData () {
      this.$refs.addFormRef.validate((valid, object) => {
        if (valid) {
          const param = _.cloneDeep(this.configuration)
          const props = []
          const config1 = _.find(this.allConfig, c => c.name === param.name)
          let exist = null
          _.forEach(param.properties, p => {
            p.property = p.name
            if (p.type === 'string') {
              p.type = { name: '字符串', id: 'string', type: 'string' }
            } else if (p.type === 'password') {
              p.type = { name: '密码', id: 'password', type: 'password' }
            }
            if (!_.isEmpty(_.filter(config1.properties, p => _.includes(props, p.property)))) {
              exist = p.property + '已经存在'
            }
            props.push(p.property)
          })
          if (exist) {
            this.$message.error(exist)
            return
          }
          this.$emit('save', param)
          this.visibleChange(false)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
