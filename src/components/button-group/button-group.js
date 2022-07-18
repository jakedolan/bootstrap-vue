import { defineComponent, h } from 'vue'
import { NAME_BUTTON_GROUP } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { SLOT_NAME_DEFAULT } from '../../constants/slots'
import { pick, sortKeys } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { props as buttonProps } from '../button/button'
import { normalizeSlot } from '../../utils/normalize-slot'

// --- Props ---

export const props = makePropsConfigurable(
    sortKeys({
        ...pick(buttonProps, ['size']),
        ariaRole: makeProp(PROP_TYPE_STRING, 'group'),
        size: makeProp(PROP_TYPE_STRING),
        tag: makeProp(PROP_TYPE_STRING, 'div'),
        vertical: makeProp(PROP_TYPE_BOOLEAN, false)
    }),
    NAME_BUTTON_GROUP
)

// --- Main component ---

// @vue/component
export const BButtonGroup = /*#__PURE__*/ defineComponent({
    name: NAME_BUTTON_GROUP,
    props,
    render() {
        const { $props, $slots } = this

        const componentData = {
            class: [{
                'btn-group': !$props.vertical,
                'btn-group-vertical': $props.vertical,
                [`btn-group-${$props.size}`]: $props.size
            }],
            role: $props.ariaRole
        }
        return h(
            $props.tag,
            componentData,
            normalizeSlot(SLOT_NAME_DEFAULT, {}, $slots)
        )
    }
})