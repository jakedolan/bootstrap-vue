import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_FORM_TEXT } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        id: makeProp(PROP_TYPE_STRING),
        inline: makeProp(PROP_TYPE_BOOLEAN, false),
        tag: makeProp(PROP_TYPE_STRING, 'small'),
        textVariant: makeProp(PROP_TYPE_STRING, 'muted')
    },
    NAME_FORM_TEXT
)

// --- Main component ---

// @vue/component
export const BFormText = /*#__PURE__*/ defineComponent({
    name: NAME_FORM_TEXT,
    props,
    render(h, { props, data, children }) {
        return h(
            props.tag,
            mergeData(data, {
                class: {
                    'form-text': !props.inline, [`text-${props.textVariant}`]: props.textVariant
                },
                id: props.id
            }),
            children
        )
    }
})
