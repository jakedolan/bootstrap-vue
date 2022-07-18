// --- Utils for testing ---

export const wrapWithMethods = (Component, methods) => ({
  inheritAttrs: false,
  components: { wrappedComponent: Component },
  methods,
  template: `
    <wrapped-component v-bind="$attrs">
      <template v-for="(_, name) in $slots" :slot="name" slot-scope="slotData"><slot :name="name" v-bind="slotData" /></template>
    </wrapped-component>
  `
})

export const waitNT = ctx => new Promise(resolve => ctx.$nextTick(resolve))
export const waitRAF = () => new Promise(resolve => requestAnimationFrame(resolve))
