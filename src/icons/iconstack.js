import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_ICONSTACK } from '../constants/components'
import { omit } from '../utils/object'
import { makePropsConfigurable } from '../utils/props'
import { BVIconBase, props as BVIconBaseProps } from './helpers/icon-base'

// --- Props ---

export const props = makePropsConfigurable(
  omit(BVIconBaseProps, ['content', 'stacked']),
  NAME_ICONSTACK
)

// --- Main component ---

// @vue/component
export const BIconstack = /*#__PURE__*/ defineComponent({
  name: NAME_ICONSTACK,
  functional: true,
  props,
  render(h, { data, props, children }) {
    return h(
      BVIconBase,
      mergeData(data, {
        class: 'b-iconstack',
        ...(props || {})
      }),
      children
    )
  }
})
