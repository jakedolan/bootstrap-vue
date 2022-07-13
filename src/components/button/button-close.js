import { defineComponent, h } from 'vue'
import { NAME_BUTTON_CLOSE } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { SLOT_NAME_DEFAULT } from '../../constants/slots'
import { stopEvent } from '../../utils/events'
import { isEvent } from '../../utils/inspect'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot'

// --- Props ---

export const props = makePropsConfigurable({
        ariaLabel: makeProp(PROP_TYPE_STRING, 'Close'),
        content: makeProp(PROP_TYPE_STRING, '&times;'),
        disabled: makeProp(PROP_TYPE_BOOLEAN, false),
        textVariant: makeProp(PROP_TYPE_STRING)
    },
    NAME_BUTTON_CLOSE
)

// --- Main component ---

// @vue/component
export const BButtonClose = /*#__PURE__*/ defineComponent({
    name: NAME_BUTTON_CLOSE,
    compatConfig: {
        MODE: 3,
        INSTANCE_SCOPED_SLOTS: 'suppress-warning'
    },
    functional: true,
    props,
    render() {
        const { $props, $slots } = this

        const componentData = {
            class: ['close', {
                [`text-${$props.textVariant}`]: $props.textVariant
            }],
            type: 'button',
            disabled: $props.disabled,
            'aria-label': $props.ariaLabel ? String($props.ariaLabel) : null,
            onClick: (event) => {
                // Ensure click on button HTML content is also disabled
                /* istanbul ignore if: bug in JSDOM still emits click on inner element */
                if ($props.disabled && isEvent(event)) {
                    stopEvent(event)
                }
            }
        }

        componentData.innerHTML = $props.content;

        return h(
            'button',
            componentData, {
                default: () => [$props.content]
            }
        )
    }
})