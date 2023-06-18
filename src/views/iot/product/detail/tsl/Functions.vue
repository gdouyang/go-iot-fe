
<template>
  <div>
    <a-card title="功能定义" :style="{marginBottom: '20px'}">
      <a-button type="primary" slot="extra" @click="add">添加</a-button>
      <a-table rowKey="id" :columns="columns" :dataSource="data">
        <span slot="async" slot-scope="text">{{ (text ? '是' : '否') }}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除？"
            @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <FunctionsAdd
      v-if="visible"
      :product="product"
      :data="current"
      @save="saveData"
      @close="close"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import FunctionsAdd from './add/FunctionsAdd.vue'
export default {
  name: 'Functions',
  components: {
    FunctionsAdd
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      columns: [
        { title: '功能标识', dataIndex: 'id' },
        { title: '名称', dataIndex: 'name' },
        { title: '是否异步', dataIndex: 'async', scopedSlots: { customRender: 'async' } },
        { title: '说明', dataIndex: 'description', width: '30%', ellipsis: true },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ],
      visible: false,
      current: {},
      isEdit: false
    }
  },
  mounted () {
  },
  methods: {
    add () {
      this.isEdit = false
      this.current = {}
      this.visible = true
    },
    edit (item) {
      this.isEdit = true
      this.current = _.cloneDeep(item)
      this.visible = true
    },
    remove (item) {
      const temp = this.data.filter(e => e.id !== item.id)
      this.$emit('save', temp)
    },
    saveData (item, onlySave) {
      const data = this.data
      const i = data.findIndex((j) => j.id === item.id)
      if (i > -1) {
        if (!this.isEdit) {
          this.$message.error('功能标识已存在，请修改')
          return
        }
        // data[i] = item;
        this.$set(data, i, item)
      } else {
        data.push(item)
      }
      this.$emit('save', data, onlySave)
      this.close()
    },
    close () {
      this.current = {}
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
