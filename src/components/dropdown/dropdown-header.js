import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_DROPDOWN_HEADER } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { isTag } from '../../utils/dom'
import { omit } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        id: makeProp(PROP_TYPE_STRING),
        tag: makeProp(PROP_TYPE_STRING, 'header'),
        variant: makeProp(PROP_TYPE_STRING)
    },
    NAME_DROPDOWN_HEADER
)

// --- Main component ---

// @vue/component
export const BDropdownHeader = /*#__PURE__*/ defineComponent({
    name: NAME_DROPDOWN_HEADER,
    props,
    render(h, { props, data, children }) {
        const { tag, variant } = props

        return h('li', mergeData(omit(data, ['attrs']), { role: 'presentation' }), [
            h(
                tag, {
                    class: ['dropdown-header', { [`text-${variant}`]: variant } ],
                    ...(data.attrs || {}),
                    id: props.id || null,
                    role: isTag(tag, 'header') ? null : 'heading',
                    ref: 'header'
                },
                children
            )
        ])
    }
})