
<template>
  <div>
    <a-card title="事件定义" :style="{marginBottom: '20px'}">
      <a-button type="primary" slot="extra" @click="add">添加</a-button>
      <a-table rowKey="id" :columns="columns" :dataSource="data">
        <span slot="level" slot-scope="text">{{ (gradeText[text]) }}</span>
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
    <EventsAdd
      v-if="visible"
      :data="current"
      :unitsData="unitsData"
      @save="saveData"
      @close="close"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import EventsAdd from './event/Events-add.vue'
export default {
  name: 'Events',
  components: {
    EventsAdd
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    unitsData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      columns: [
        { title: '事件标识', dataIndex: 'id' },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '事件级别',
          dataIndex: 'expands.level',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '说明',
          dataIndex: 'description',
          width: '30%',
          ellipsis: true
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      gradeText: {
        ordinary: '普通',
        warn: '警告',
        urgent: '紧急'
      },
      visible: false,
      current: {}
    }
  },
  mounted () {
  },
  methods: {
    add () {
      this.current = {}
      this.visible = true
    },
    edit (item) {
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
