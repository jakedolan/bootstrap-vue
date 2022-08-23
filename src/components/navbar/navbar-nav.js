import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_NAVBAR_NAV } from '../../constants/components'
import { pick } from '../../utils/object'
import { makePropsConfigurable } from '../../utils/props'
import { props as BNavProps } from '../nav/nav'

// --- Helper methods ---

const computeJustifyContent = value => {
    value = value === 'left' ? 'start' : value === 'right' ? 'end' : value
    return `justify-content-${value}`
}

// --- Props ---

export const props = makePropsConfigurable(
    pick(BNavProps, ['tag', 'fill', 'justified', 'align', 'small']),
    NAME_NAVBAR_NAV
)

// --- Main component ---

// @vue/component
export const BNavbarNav = /*#__PURE__*/ defineComponent({
    name: NAME_NAVBAR_NAV,
    props,
    render(h, { props, data, children }) {
        const { align } = props

        return h(
            props.tag,
            mergeData(data, {
                class: ['navbar-nav', {
                    'nav-fill': props.fill,
                    'nav-justified': props.justified,
                    [computeJustifyContent(align)]: align,
                    small: props.small
                }]
            }),
            children
        )
    }
})
