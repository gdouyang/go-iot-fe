<template>
  <div>
    <a-form-model-item label="JSON对象">
      <a-list bordered :dataSource="properties" v-if="properties.length > 0">
        <template slot="renderItem" slot-scope="item">
          <a-list-item>
            参数名称：{{ item.name }}
            <template slot="actions">
              <a-button type="link" @click="edit(item)">
                编辑
              </a-button>
              <a-button type="link" @click="remove(item)">
                删除
              </a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
      <a-button type="link" @click="add">
        <a-icon type="plus" />
        添加参数
      </a-button>
    </a-form-model-item>
    <Paramter
      v-if="parameterVisible"
      :data="currentParameter"
      @close="close"
      @save="save"/>
  </div>
</template>

<script>
// import _ from 'lodash'
import Paramter from '../add/Paramter.vue'
import { getPropertiesData } from './data.js'
export default {
  name: 'ObjectItem',
  components: {
    Paramter
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    if (this.data.properties) {
      this.properties = this.data.properties
    } else {
      this.data.properties = this.properties
    }
  },
  data () {
    return {
      properties: [],
      parameterVisible: false,
      currentParameter: {}
    }
  },
  mounted () {
  },
  methods: {
    add () {
      this.currentParameter = getPropertiesData()
      this.parameterVisible = true
    },
    edit (item) {
      this.currentParameter = getPropertiesData(item)
      this.parameterVisible = true
    },
    save (item) {
      if (!this.data.properties) {
        this.data.properties = []
      }
      const index = this.data.properties.findIndex((e) => e.id === item.id)
      if (index === -1) {
        this.data.properties.push(item)
      } else {
        this.$set(this.data.properties, index, item)
        // this.data.properties[index] = item
      }
      this.close()
    },
    close () {
      this.parameterVisible = false
    },
    remove (item) {
      const index = this.properties.findIndex((i) => i.id === item.id)
      this.properties.splice(index, 1)
      this.properties = this.properties
    }
  }
}
</script>
