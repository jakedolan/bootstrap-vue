import { defineComponent, h } from 'vue'
import { NAME_ICON } from '../constants/components'
import { PROP_TYPE_STRING } from '../constants/props'
import { RX_ICON_PREFIX } from '../constants/regex'
import { omit, sortKeys } from '../utils/object'
import { makeProp, makePropsConfigurable, pluckProps } from '../utils/props'
import { pascalCase, trim } from '../utils/string'
import { BIconBlank } from './icons'
import { props as BVIconBaseProps } from './helpers/icon-base'

// --- Helper methods ---

const findIconComponent = (ctx, iconName) => {
  if (!ctx) {
    return Vue.component(iconName)
  }
  const components = (ctx.$options || {}).components
  const iconComponent = components && components[iconName]
  return iconComponent || findIconComponent(ctx.$parent, iconName)
}

// --- Props ---

const iconProps = omit(BVIconBaseProps, ['content'])

export const props = makePropsConfigurable(
  sortKeys({
    ...iconProps,
    icon: makeProp(PROP_TYPE_STRING)
  }),
  NAME_ICON
)

// --- Main component ---

// Helper BIcon component
// Requires the requested icon component to be installed
// @vue/component
export const BIcon = /*#__PURE__*/ defineComponent({
  name: NAME_ICON,
  functional: true,
  props,
  render() {
    const { $props, $parent } = this
    const icon = pascalCase(trim($props.icon || '')).replace(RX_ICON_PREFIX, '')


    console.log("## iconProps", iconProps);
    console.log("## $props", $props);
    const componentData = {
      ...pluckProps(iconProps, $props)      
    }

    console.log('## componentData', componentData)
    // If parent context exists, we check to see if the icon has been registered
    // either locally in the parent component, or globally at the `$root` level
    // If not registered, we render a blank icon
    return h(
      icon ? findIconComponent($parent, `BIcon${icon}`) || BIconBlank : BIconBlank,
      componentData)
    
  }
})
