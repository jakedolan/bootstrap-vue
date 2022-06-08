export const getInstanceFromVNode = vnode =>
  vnode.__vueParentComponent.ctx
