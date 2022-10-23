<style lang="less">
</style>

<template>
  <div>
    <Dialog ref="addModal" @confirm="addConfirm" @close="addClose">
      <a-form-model
        ref="addFormRef"
        :model="addObj"
        style="width: 90%"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          label="产品ID"
          prop="id"
          :rules="[
            {required: true, message: '请输入产品ID'},
            {max: 64, message: '产品ID不超过64个字符'},
            {pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '产品ID只能由数字、字母、下划线、中划线组成'}
          ]"
        >
          <a-input
            v-model="addObj.id"
            :maxLength="32"
            :disabled="isEdit"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="名称"
          prop="name"
          :rules="[
            { required: true, message: '名称不能为空' }
          ]"
        >
          <a-input v-model="addObj.name" placeholder="名称" :maxLength="32"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="所属品类"
          prop="classifiedId"
          :rules="[{ required: true, message: '请选择所属品类', trigger: 'change' }]"
        >
          <a-cascader
            v-model="addObj.classifiedId"
            :fieldNames="{label: 'name', value: 'id', children: 'children'}"
            :options="classified"
            :popupVisible="false"
            @change="(value) => {
              if (value.length === 0) {
                this.classifiedData = {}
              }
            }"
            @click="() => classifiedVisible = true"
            placeholder="点击选择品类"/>
        </a-form-model-item>
        <a-form-model-item
          label="消息协议"
          prop="messageProtocol"
          :rules="[{ required: true, message: '请选择消息协议', trigger: 'change' }]"
        >
          <a-select v-model="addObj.messageProtocol" @change="messageProtocolChange">
            <a-select-option v-for="p in protocolSupports" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="传输协议"
          prop="transportProtocol"
          :rules="[{ required: true, message: '请选择传输协议', trigger: 'change' }]"
        >
          <a-select v-model="addObj.transportProtocol" @change="transportProtocolChange">
            <a-select-option v-for="p in protocolTransports" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="设备类型"
          prop="deviceType"
          :rules="[{ required: true, message: '请选择设备类型' }]"
        >
          <a-radio-group v-model="addObj.deviceType">
            <a-radio value="device">直连设备</a-radio>
            <a-radio value="childrenDevice">网关子设备</a-radio>
            <a-radio value="gateway">网关设备</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="云云对接"
          prop="bindProvider"
          v-if="addObj.messageProtocol === 'OneNet'"
        >
          <a-select v-model="addObj.bindProvider" :disabled="isEdit" :allowClear="true">
            <a-select-option v-for="p in bindProviders" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="说明" prop="describe">
          <a-input
            type="textarea"
            v-model="addObj.describe"
            placeholder="说明"
            :maxLength="200"
            show-word-limit></a-input>
        </a-form-model-item>
      </a-form-model>
    </Dialog>

    <Classified
      v-if="classifiedVisible"
      @choice="classifiedChoice"
      @close="() => classifiedVisible = false"
      :data="classifiedData"/>
  </div>
</template>

<script>
import _ from 'lodash'
import Classified from './classified.vue'

const defaultAddObj = {
  id: null,
  name: '',
  classifiedId: [],
  classifiedName: '',
  messageProtocol: '',
  protocolName: '',
  protocolId: '',
  metadata: { events: [], properties: [], functions: [], tags: [] },
  transportProtocol: '',
  networkWay: '',
  deviceType: '',
  describe: '',
  bindProvider: ''
}
export default {
  name: 'ProductAdd',
  components: {
    Classified
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      addObj: _.cloneDeep(defaultAddObj),
      isEdit: false,
      protocolSupports: [],
      protocolTransports: [], // 传输协议
      classified: [],
      classifiedVisible: false,
      classifiedData: {},
      bindProviders: []
    }
  },
  created () {
  },
  methods: {
    add () {
      this.isEdit = false
      this.deviceCategoryTree()
      this.getProtocolSupports()
      this.getBindProviders()
      this.$refs.addModal.open({ title: '新增产品' })
    },
    edit (row) {
      this.isEdit = true
      this.getProtocolSupports()
      this.deviceCategoryTree()
      this.getBindProviders()
      this.$http.get(`device-product/${row.id}`)
        .then((data) => {
          if (data.success) {
            const result = data.result
            this.classifiedData = { id: result.classifiedId, name: result.classifiedName }
            // 反显所属品类
            const classified = _.filter(_.split(result.classifiedId, '|'), s => s && s.trim())
            const list = []
            classified.map((item, index) => {
              if (index === 0) {
                list.push('|' + item + '|')
              } else if (index === 1) {
                list.push(list[0] + item + '|')
              }
            })
            list.push(result.classifiedId)
            result.classifiedId = list
            // 反显设备类型
            result.deviceType = result.deviceType.value
            this.addObj = result
            this.$refs.addModal.open({ title: '修改产品' })
            // 反显传输协议
            this.messageProtocolChange(result.messageProtocol)
          }
        })
    },
    addClose () {
      this.addObj = _.cloneDeep(defaultAddObj)
      this.$refs.addFormRef.resetFields()
    },
    addConfirm () {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          let promise = null
          const saveData = _.cloneDeep(this.addObj)
          saveData.state = 0
          saveData.deviceType = { value: saveData.deviceType }
          saveData.metadata = this.defaultMetadata
          saveData.classifiedId = this.classifiedData.id
          saveData.classifiedName = this.classifiedData.name
          if (saveData.messageProtocol !== 'OneNet') {
            saveData.bindProvider = ''
          }
          if (this.isEdit) {
            promise = this.$http.put(`device-product/${saveData.id}`, saveData)
          } else {
            promise = this.$http.post('device-product', saveData)
          }
          promise.then((resp) => {
            if (resp.success) {
              this.$message.success('操作成功')
              this.$refs.addModal.close()
              this.$emit('success')
            } else {
              this.$message.success(resp.message)
            }
          })
        }
      })
    },
    getProtocolSupports () {
      this.$http.get('protocol/supports').then(data => {
        if (data.success) {
          this.protocolSupports = _.filter(data.result, d => d.id !== 'jetlinks.v1.0')
        }
      })
    },
    messageProtocolChange (value) {
      const find = _.find(this.protocolSupports, p => p.id === value)
      if (find) {
        this.addObj.protocolName = find.name
      }
      // 传输协议
      this.$http.get(`protocol/${value}/transports`).then(data => {
        if (data.success) {
          this.protocolTransports = data.result
        }
      })
    },
    transportProtocolChange (value) {
      if (value !== '' && value !== undefined && this.addObj.messageProtocol) {
        this.getDefaultModel(this.addObj.messageProtocol, value)
      }
    },
    getDefaultModel (id, transport) {
      this.$http.get(`protocol/${id}/${transport}/metadata`)
      .then(res => {
        if (res.success && res.result && res.result !== '{}') {
          this.defaultMetadata = JSON.parse(res.result)
        } else {
          this.defaultMetadata = _.cloneDeep(defaultAddObj.metadata)
        }
      })
      .catch(() => {
        this.defaultMetadata = _.cloneDeep(defaultAddObj.metadata)
      })
    },
    deviceCategoryTree () {
      return this.$http.get(`/device/category/_tree`)
      .then(data => {
        this.classified = data.result
      })
    },
    classifiedChoice (item) {
      const categoryId = item.categoryId
      this.addObj.classifiedId = categoryId
      this.classifiedData = item
      this.classifiedVisible = false
    },
    getBindProviders () {
      this.$http.get(`/device-instance/bind-providers`)
      .then(data => {
        this.bindProviders = data.result
      })
    }

  }
}
</script>
