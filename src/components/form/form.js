import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_FORM } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        id: makeProp(PROP_TYPE_STRING),
        inline: makeProp(PROP_TYPE_BOOLEAN, false),
        novalidate: makeProp(PROP_TYPE_BOOLEAN, false),
        validated: makeProp(PROP_TYPE_BOOLEAN, false)
    },
    NAME_FORM
)

// --- Main component ---

// @vue/component
export const BForm = /*#__PURE__*/ defineComponent({
    name: NAME_FORM,
    props,
    render(h, { props, data, children }) {
        return h(
            'form',
            mergeData(data, {
                class: {
                    'form-inline': props.inline,
                        'was-validated': props.validated
                },
                id: props.id,
                novalidate: props.novalidate
            }),
            children
        )
    }
})
