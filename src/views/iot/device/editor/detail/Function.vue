<template>
  <a-spin :spinning="spinning">
    <a-card :style="{ marginBottom: '20px' }" title="功能调试">
      <a-collapse v-model="activeKey" style="width: 500px;">
        <a-collapse-panel v-for="f in functionsSelectList" :key="f.id" :header="f.name">
          <div style="text-align: right;">
            <a-button type="link" icon="bug" style="height: auto;" @click.prevent="debugFunction(f)">
              发送指令
            </a-button>
          </div>
          <!-- <a-empty :description="false" v-if="!f.inputs || f.inputs.length < 1"/> -->
          <p>
            <FunctionForm :inputs="f.inputs" :ref="'funcForm-' + f.id"/>
            <!-- {{ f.inputs }} -->
          </p>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </a-spin>
</template>

<script>
// import _ from 'lodash'
import { cmdInvoke } from '@/views/iot/device/api.js'
import FunctionForm from './functions/FunctionForm.vue'
export default {
  name: 'DeviceFunction',
  props: {
    device: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    FunctionForm
  },
  data () {
    return {
      functionsSelectList: [],
      activeKey: [],
      spinning: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const { functions } = JSON.parse(this.device.metadata)
      const map = {}
      const functionsSelectList = []
      functions.forEach((item) => {
        map[item.id] = item
        functionsSelectList.push(item)
      })
      this.functionsSelectList = functionsSelectList
    },
    debugFunction (fun) {
      const functionId = fun.id
      const deviceId = this.device.id
      const refId = 'funcForm-' + functionId
      const ref = this.$refs[refId]
      const params = {
        functionId: functionId
      }
      if (ref) {
        params.data = ref[0].getData()
      }
      // _.forIn(params.data, (value, key) => {
      //   params.data[key] = _.toString(value)
      // })
      this.spinning = true
      cmdInvoke(deviceId, params).then(resp => {
        if (resp.success) {
          this.$message.success('操作成功')
        }
      }).finally(() => {
        this.spinning = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
