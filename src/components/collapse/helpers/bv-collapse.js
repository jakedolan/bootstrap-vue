// Generic collapse transion helper component
//
// Note:
//   Applies the classes `collapse`, `show` and `collapsing`
//   during the enter/leave transition phases only
//   Although it appears that Vue may be leaving the classes
//   in-place after the transition completes
import { defineComponent, h, Transition } from 'vue'
import { NAME_COLLAPSE_HELPER } from '../../../constants/components'
import { PROP_TYPE_BOOLEAN } from '../../../constants/props'
import { SLOT_NAME_DEFAULT } from '../../../constants/slots'
import { getBCR, reflow, removeStyle, requestAF, setStyle } from '../../../utils/dom'
import { makeProp } from '../../../utils/props'
import { normalizeSlot } from '../../../utils/normalize-slot'

// --- Helper methods ---

// Transition event handler helpers
const onEnter = el => {
    setStyle(el, 'height', 0)
        // In a `requestAF()` for `appear` to work
    requestAF(() => {
        reflow(el)
        setStyle(el, 'height', `${el.scrollHeight}px`)
    })
}

const onAfterEnter = el => {
    removeStyle(el, 'height')
}

const onLeave = el => {
    setStyle(el, 'height', 'auto')
    setStyle(el, 'display', 'block')
    setStyle(el, 'height', `${getBCR(el).height}px`)
    reflow(el)
    setStyle(el, 'height', 0)
}

const onAfterLeave = el => {
    removeStyle(el, 'height')
}

// --- Constants ---

// Default transition props
// `appear` will use the enter classes
const TRANSITION_PROPS = {
    css: true,
    enterFromClass: '',
    enterActiveClass: 'collapsing',
    enterToClass: 'collapse show',
    leaveFromClass: 'collapse show',
    leaveActiveClass: 'collapsing',
    leaveToClass: 'collapse'
}

// Default transition handlers
// `appear` will use the enter handlers
const TRANSITION_HANDLERS = {
    onEnter: onEnter,
    onAfterEnter: onAfterEnter,
    onLeave: onLeave,
    onAfterLeave: onAfterLeave
}

// --- Main component ---

export const props = {
    // If `true` (and `visible` is `true` on mount), animate initially visible
    appear: makeProp(PROP_TYPE_BOOLEAN, false)
}

// --- Main component ---

// @vue/component
export const BVCollapse = /*#__PURE__*/ defineComponent({
    name: NAME_COLLAPSE_HELPER,
    inheritAttrs: false,
    props,
    render() {
        const { $props, $data, $slots } = this

        const componentData = {
            ...TRANSITION_PROPS,
            ...TRANSITION_HANDLERS,
            ...$props
        }

        return h(Transition,
            // We merge in the `appear` prop last
            componentData,

            // Note: `<transition>` supports a single root element only
            {
                default: () => normalizeSlot(SLOT_NAME_DEFAULT, {}, $slots)
            }

        )
    }
})