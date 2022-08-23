import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_SKELETON } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        animation: makeProp(PROP_TYPE_STRING, 'wave'),
        height: makeProp(PROP_TYPE_STRING),
        size: makeProp(PROP_TYPE_STRING),
        type: makeProp(PROP_TYPE_STRING, 'text'),
        variant: makeProp(PROP_TYPE_STRING),
        width: makeProp(PROP_TYPE_STRING)
    },
    NAME_SKELETON
)

// --- Main component ---

// @vue/component
export const BSkeleton = /*#__PURE__*/ defineComponent({
    name: NAME_SKELETON,
    props,
    render(h, { data, props }) {
        const { size, animation, variant } = props

        return h(
            'div',
            mergeData(data, {

                style: {
                    width: size || props.width,
                    height: size || props.height
                },
                class: ['b-skeleton', {
                    [`b-skeleton-${props.type}`]: true,
                    [`b-skeleton-animate-${animation}`]: animation,
                    [`bg-${variant}`]: variant
                }]
            })
        )
    }
})
