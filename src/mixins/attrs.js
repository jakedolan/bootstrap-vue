import { defineComponent } from 'vue'

export const attrsMixin = defineComponent({
  computed: {
    bvAttrs() {
      return this.$attrs
    }
  }
})