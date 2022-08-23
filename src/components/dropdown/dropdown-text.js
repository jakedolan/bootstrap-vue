import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_DROPDOWN_TEXT } from '../../constants/components'
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props'
import { omit } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        tag: makeProp(PROP_TYPE_STRING, 'p'),
        textClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        variant: makeProp(PROP_TYPE_STRING)
    },
    NAME_DROPDOWN_TEXT
)

// --- Main component ---

// @vue/component
export const BDropdownText = /*#__PURE__*/ defineComponent({
    name: NAME_DROPDOWN_TEXT,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        const { tag, textClass, variant } = props

        return h('li', mergeData(omit(data, ['attrs']), { role: 'presentation' }), [
            h(
                tag, {
                    class: ['b-dropdown-text', textClass, {
                        [`text-${variant}`]: variant
                    }],
                    ...(props || {}),
                    ...(data.attrs || {}),
                    ref: 'text'
                },
                slots
            )
        ])
    }
})
