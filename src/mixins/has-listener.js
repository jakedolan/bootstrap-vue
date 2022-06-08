// Mixin to determine if an event listener has been registered
// either via `v-on:name` (in the parent) or programmatically
// via `vm.$on('name', ...)`
// See: https://github.com/vuejs/vue/issues/10825
import { defineComponent } from 'vue'

// @vue/component
export const hasListenerMixin = defineComponent({
  methods: {
    hasListener(name) {
        return true
    }
  }
})
