// Generic Bootstrap v4 fade (no-fade) transition component
//
// Assumes that `show` class is not required when
// the transition has finished the enter transition
// (show and fade classes are only applied during transition)

import { defineComponent, h, Transition } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_TRANSITION } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props'
import { SLOT_NAME_DEFAULT } from '../../constants/slots'
import { isPlainObject } from '../../utils/inspect'
import { cloneDeep } from '../../utils/clone-deep'
import { makeProp } from '../../utils/props'
import { normalizeSlot } from '../../utils/normalize-slot'

// --- Constants ---

const NO_FADE_PROPS = {
    name: '',
    enterFromClass: '',
    enterActiveClass: '',
    enterToClass: 'show',
    leaveFromClass: 'show',
    leaveActiveClass: '',
    leaveToClass: ''
}

const FADE_PROPS = {
    ...NO_FADE_PROPS,
    enterActiveClass: 'fade',
    leaveActiveClass: 'fade'
}

// --- Props ---

export const props = {
    // Has no effect if `trans-props` provided
    appear: makeProp(PROP_TYPE_BOOLEAN, false),
    // Can be overridden by user supplied `trans-props`
    mode: makeProp(PROP_TYPE_STRING),
    // Only applicable to the built in transition
    // Has no effect if `trans-props` provided
    noFade: makeProp(PROP_TYPE_BOOLEAN, false),
    // For user supplied transitions (if needed)
    transProps: makeProp(PROP_TYPE_OBJECT)
}

// --- Main component ---

// @vue/component
export const BVTransition = /*#__PURE__*/ defineComponent({
    name: NAME_TRANSITION,
    props,
    render() {
        let transProps = cloneDeep(this.$props.transProps)
        if (!isPlainObject(transProps)) {
            transProps = this.$props.noFade ? NO_FADE_PROPS : FADE_PROPS
            if (this.$props.appear) {
                // Default the appear classes to equal the enter classes
                transProps = {
                    ...transProps,
                    appear: true,
                    appearFromClass: transProps.enterFromClass,
                    appearActiveClass: transProps.enterActiveClass,
                    appearToClass: transProps.enterToClass
                }
            }
        }
        transProps = {
            mode: this.$props.mode,
            ...transProps,
            // We always need `css` true
            css: true
        }

        const componentData = { ...transProps };
        // const dataCopy = cloneDeep(this.$data);
        // delete dataCopy.props

        return h(
          Transition,
            // Any transition event listeners will get merged here
            componentData,
            {
              default: () => normalizeSlot(SLOT_NAME_DEFAULT, {}, this.$slots),
            }
        )
    }
})