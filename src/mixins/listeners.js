import { defineComponent } from 'vue'

export const listenersMixin = defineComponent({
  compatConfig: {
    MODE: 3,
    INSTANCE_LISTENERS: 'suppress-warning'
  },
  data() {
    return {
      bvListeners: {}
    }
  },
  created() {
    this.bvListeners = {
      ...this.$listeners
    }
  },
  beforeUpdate() {
    this.bvListeners = {
      ...this.$listeners
    }
  }
})
