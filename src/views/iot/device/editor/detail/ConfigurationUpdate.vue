<template>
  <a-drawer
    title="修改配置"
    width="500"
    visible
    :afterVisibleChange="visibleChange"
    :maskClosable="false"
    @close="visibleChange(false)">
    <a-form-model :labelCol="{ span: 3 }" :wrapperCol="{ span: 16 }" ref="addFormRef" :model="configuration">
      <a-row :gutter="16">
        <a-col>
          <a-form-model-item
            prop="property"
            label="Key"
            :rules="[
              { required: true, message: 'Key不能为空', trigger: 'blur' }
            ]"
          >
            <a-input v-model="configuration.property" :disabled="true" :maxLength="32"></a-input>
          </a-form-model-item>
          <a-form-model-item label="值">
            <a-input v-model="configuration.value" :maxLength="100"></a-input>
          </a-form-model-item>
        </a-col>
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
import { updateDevice } from '@/views/iot/device/api.js'
const defaultData = { property: '', desc: '', type: null, value: '' }
export default {
  name: 'ConfigurationAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    deviceId: {
      type: String,
      default: () => null
    },
    allConfig: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => null
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
      configuration: _.cloneDeep(defaultData),
      isEdit: false
    }
  },
  methods: {
    visibleChange (flag) {
      if (!flag) {
        this.$emit('close')
      } else {
        const d = _.cloneDeep(this.data)
        this.configuration = d
      }
    },
    saveData () {
      this.$refs.addFormRef.validate((valid, object) => {
        if (valid) {
          const p = _.cloneDeep(this.configuration)
          this.updateData(p)
        }
      })
    },
    updateData (item) {
      const p = _.cloneDeep(this.allConfig)
      p[item.property] = item.value
      const param = {
        id: this.deviceId,
        metaconfig: p
      }
      this.updateVisible = false
      updateDevice(param).then((response) => {
        if (response.status === 200) {
          this.$message.success('配置信息修改成功')
          this.$emit('refresh')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
