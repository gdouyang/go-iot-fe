<template>
  <a-drawer :title="isEdit ? '修改配置' : '添加配置'" width="500" visible :afterVisibleChange="visibleChange" @close="visibleChange(false)">
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
            <a-input v-model="configuration.property" :disabled="isEdit" :maxLength="32"></a-input>
          </a-form-model-item>
          <a-form-model-item
            prop="type"
            label="类型"
            :rules="[
              { required: true, message: '类型不能为空', trigger: 'change' }
            ]"
          >
            <a-select
              v-model="configuration.type"
            >
              <a-select-option value="string">字符串</a-select-option>
              <a-select-option value="password">密码</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="值">
            <a-input v-model="configuration.value" :maxLength="100"></a-input>
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-input v-model="configuration.desc" :maxLength="100"></a-input>
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
import { updateProduct } from '@/views/iot/product/api.js'
const defaultData = { property: '', desc: '', type: null, value: '' }
export default {
  name: 'ConfigurationAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    allConfig: {
      type: Array,
      default: () => []
    },
    productId: {
      type: String,
      default: () => null
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
        if (this.data) {
          const d = _.cloneDeep(this.data)
          this.configuration = d
          this.isEdit = true
        } else {
          this.isEdit = false
          this.configuration = _.cloneDeep(defaultData)
        }
      }
    },
    saveData () {
      this.$refs.addFormRef.validate((valid, object) => {
        if (valid) {
          const p = _.cloneDeep(this.configuration)
          const config1 = _.filter(this.allConfig, c => c.property === p.property)
          if ((!this.isEdit && _.size(config1) > 0) || (this.isEdit && _.size(config1) > 1)) {
            this.$message.error(p.property + '已经存在')
            return
          }
          if (this.isEdit) {
            const conf = _.cloneDeep(this.allConfig)
            const find = _.find(conf, c => c.property === p.property)
            find.value = p.value
            find.desc = p.desc
            find.type = p.type
            const param = {
              id: this.productId,
              metaconfig: JSON.stringify(conf)
            }
            this.updateData(param)
          } else {
            const conf = _.cloneDeep(this.allConfig)
            conf.push(p)
            const param = {
              id: this.productId,
              metaconfig: JSON.stringify(conf)
            }
            this.updateData(param)
          }
        }
      })
    },
    updateData (item) {
      updateProduct(this.productId, item).then((resp) => {
        if (resp.success) {
          this.$message.success('配置信息修改成功')
          this.visibleChange(false)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
