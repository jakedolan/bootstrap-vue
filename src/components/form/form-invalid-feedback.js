import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_FORM_INVALID_FEEDBACK } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        ariaLive: makeProp(PROP_TYPE_STRING),
        forceShow: makeProp(PROP_TYPE_BOOLEAN, false),
        id: makeProp(PROP_TYPE_STRING),
        role: makeProp(PROP_TYPE_STRING),
        // Tri-state prop: `true`, `false`, or `null`
        state: makeProp(PROP_TYPE_BOOLEAN, null),
        tag: makeProp(PROP_TYPE_STRING, 'div'),
        tooltip: makeProp(PROP_TYPE_BOOLEAN, false)
    },
    NAME_FORM_INVALID_FEEDBACK
)

// --- Main component ---

// @vue/component
export const BFormInvalidFeedback = /*#__PURE__*/ defineComponent({
    name: NAME_FORM_INVALID_FEEDBACK,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        const { tooltip, ariaLive } = props
        const show = props.forceShow === true || props.state === false

        return h(
            props.tag,
            mergeData(data, {
                class: {
                    'd-block': show,
                    'invalid-feedback': !tooltip,
                    'invalid-tooltip': tooltip
                },
                id: props.id || null,
                role: props.role || null,
                'aria-live': ariaLive || null,
                'aria-atomic': ariaLive ? 'true' : null

            }),
            slots
        )
    }
})
