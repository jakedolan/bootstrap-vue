import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_INPUT_GROUP_ADDON } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { BInputGroupText } from './input-group-text'

// --- Props ---

export const props = makePropsConfigurable({
        append: makeProp(PROP_TYPE_BOOLEAN, false),
        id: makeProp(PROP_TYPE_STRING),
        isText: makeProp(PROP_TYPE_BOOLEAN, false),
        tag: makeProp(PROP_TYPE_STRING, 'div')
    },
    NAME_INPUT_GROUP_ADDON
)

// --- Main component ---

// @vue/component
export const BInputGroupAddon = /*#__PURE__*/ defineComponent({
    name: NAME_INPUT_GROUP_ADDON,
    props,
    render(h, { props, data, children }) {
        const { append } = props

        return h(
            props.tag,
            mergeData(data, {
                class: {
                    'input-group-append': append,
                    'input-group-prepend': !append
                },
                id: props.id
            }),
            props.isText ? [h(BInputGroupText, children)] : children
        )
    }
})
