import { defineComponent } from 'vue'

export const listenersMixin = defineComponent({
  data() {
    return {
      bvListeners: {}
    }
  },
  computed: {
    $listeners() {
      const onRE = /^on[^a-z]/
      const listeners = {}
      const { $attrs } = this
      for (const property in $attrs) {
        if (onRE.test(property)) {
          listeners[property] = $attrs[property]
        }
      }
      return listeners;
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
