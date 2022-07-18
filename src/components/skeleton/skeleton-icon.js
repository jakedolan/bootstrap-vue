import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_SKELETON_ICON } from '../../constants/components'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { BIcon } from '../../icons'

// --- Props ---

export const props = makePropsConfigurable({
        animation: makeProp(PROP_TYPE_STRING, 'wave'),
        icon: makeProp(PROP_TYPE_STRING),
        iconProps: makeProp(PROP_TYPE_OBJECT, {})
    },
    NAME_SKELETON_ICON
)

// --- Main component ---

// @vue/component
export const BSkeletonIcon = /*#__PURE__*/ defineComponent({
    name: NAME_SKELETON_ICON,
    props,
    render(h, { data, props }) {
        const { icon, animation } = props

        const $icon = h(BIcon, {
            class: 'b-skeleton-icon',
            ...props.iconProps,
            icon
        })

        return h(
            'div',
            mergeData(data, {
                class: ['b-skeleton-icon-wrapper position-relative d-inline-block overflow-hidden', {
                        [`b-skeleton-animate-${animation}`]: animation }
                ]
            }), [$icon]
        )
    }
})