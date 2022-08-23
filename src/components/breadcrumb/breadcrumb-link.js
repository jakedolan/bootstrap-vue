import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_BREADCRUMB_LINK } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { htmlOrText } from '../../utils/html'
import { omit, sortKeys } from '../../utils/object'
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props'
import { BLink, props as BLinkProps } from '../link/link'

// --- Props ---

export const props = makePropsConfigurable(
    sortKeys({
        ...omit(BLinkProps, ['event', 'routerTag']),
        ariaCurrent: makeProp(PROP_TYPE_STRING, 'location'),
        html: makeProp(PROP_TYPE_STRING),
        text: makeProp(PROP_TYPE_STRING)
    }),
    NAME_BREADCRUMB_LINK
)

// --- Main component ---

// @vue/component
export const BBreadcrumbLink = /*#__PURE__*/ defineComponent({
    name: NAME_BREADCRUMB_LINK,
    props,
    render() {
        const { $props: suppliedProps, $data: data, $slots: slots } = this;
        const { active } = suppliedProps
        const tag = active ? 'span' : BLink

        const componentData = {
            'aria-current': active ? suppliedProps.ariaCurrent : null,
            ...pluckProps(props, suppliedProps),
            ...(!children ? htmlOrText(suppliedProps.html, suppliedProps.text) : {})
        }

        return h(tag, mergeData(data, componentData), slots)
    }
})
