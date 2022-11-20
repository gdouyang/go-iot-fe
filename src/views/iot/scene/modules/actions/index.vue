<template>
  <div>
    <a-card size="small" :bordered="false" style="background-color: #eee;">
      <a-row>
        <span>执行动作: {{ position + 1 }}</span>
        <a-popconfirm
          title="确认删除此执行动作？"
          @confirm="$emit('remove', position)"
        >
          <a>删除</a>
        </a-popconfirm>
      </a-row>

      <a-row :gutter="16" :key="position + 1">
        <a-col :span="6">
          <a-select
            placeholder="选择动作类型"
            v-model="action.executor"
            key="trigger"
            @change="executorChange"
          >
            <a-select-option value="notifier">消息通知</a-select-option>
            <a-select-option value="device-message-sender">设备输出</a-select-option>
          </a-select>
        </a-col>
        <div v-if="action.executor === 'notifier'">
          <NotifierAction :actionData="action"/>
        </div>
        <div v-else-if="action.executor === 'device-message-sender'">
          <DeviceAction :actionData="action"/>
        </div>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { newNotifierAction, newDeviceMessageAction } from './data.js'
import NotifierAction from './NotifierAction.vue'
import DeviceAction from './DeviceAction.vue'
export default {
  name: 'Actions',
  props: {
    action: {
      type: Object,
      default: null
    },
    position: {
      type: Number,
      default: null
    }
  },
  components: {
    NotifierAction,
    DeviceAction
  },
  created () {
  },
  data () {
    return {
    }
  },
  methods: {
    executorChange (value) {
      if (value === 'notifier') {
        this.action.configuration = newNotifierAction().configuration
      } else if (value === 'device-message-sender') {
        this.action.configuration = newDeviceMessageAction().configuration
      }
      // this.action.executor = value
      this.$emit('save', this.position, this.action)
    }
  }
}
</script>
