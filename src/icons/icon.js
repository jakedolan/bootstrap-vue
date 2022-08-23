import { defineComponent, h, resolveComponent } from 'vue'
import { NAME_ICON } from '../constants/components'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../constants/props'
import { RX_ICON_PREFIX } from '../constants/regex'
import { omit, sortKeys } from '../utils/object'
import { makeProp, makePropsConfigurable, pluckProps } from '../utils/props'
import { pascalCase, trim } from '../utils/string'
import { BIconBlank } from './icons'
import { props as BVIconBaseProps } from './helpers/icon-base'
import { useIconsManager } from '../composables/icons-manager'


// --- Props ---

const iconProps = omit(BVIconBaseProps, ['content'])

// TODO: Is there a better way to deal with custom components now that $parent does not exist?
export const props = makePropsConfigurable(
    sortKeys({
        ...iconProps,
        icon: makeProp(PROP_TYPE_STRING),
        // [NEW] Vue 3 customComponent to pass declared custom icon
        customComponent: makeProp(PROP_TYPE_OBJECT, null)
    }),
    NAME_ICON
)

// --- Main component ---

// Helper BIcon component
// Requires the requested icon component to be installed
// @vue/component
export const BIcon = /*#__PURE__*/ defineComponent({
    name: NAME_ICON,
    props,
    render() {
        const { $props } = this
        const icon = pascalCase(trim($props.icon || '')).replace(RX_ICON_PREFIX, '')

        // Workaround due to $parent no longer accessible.
        const iconsManager = useIconsManager();
        if ($props.customComponent) {
            iconsManager.findOrRegister(`BIcon${icon}`, $props.customComponent)
        }

        const componentData = {
            ...pluckProps(iconProps, $props)
        }

        // TODO: $parent context no longer exists. What strategy should be used for this? Removing parent context check from findIconComponent, but this might be a performance hit.
        // If parent context exists, we check to see if the icon has been registered
        // either locally in the parent component, or globally at the `$root` level
        // If not registered, we render a blank icon
        return h(
            icon ? iconsManager.findOrRegister(`BIcon${icon}`) || BIconBlank : BIconBlank,
            componentData)

    }
})