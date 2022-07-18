import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_BREADCRUMB_ITEM } from '../../constants/components'
import { makePropsConfigurable } from '../../utils/props'
import { BBreadcrumbLink, props as BBreadcrumbLinkProps } from './breadcrumb-link'

// --- Props ---

export const props = makePropsConfigurable(BBreadcrumbLinkProps, NAME_BREADCRUMB_ITEM)

// --- Main component ---

// @vue/component
export const BBreadcrumbItem = /*#__PURE__*/ defineComponent({
    name: NAME_BREADCRUMB_ITEM,
    props,
    render(h, { props, data, children }) {
        return h(
            'li',
            mergeData(data, {
                class: ['breadcrumb-item', { active: props.active }]
            }), [h(BBreadcrumbLink, { props }, children)]
        )
    }
})