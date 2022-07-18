import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_CARD_TITLE } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { toString } from '../../utils/string'

// --- Props ---

export const props = makePropsConfigurable({
        title: makeProp(PROP_TYPE_STRING),
        titleTag: makeProp(PROP_TYPE_STRING, 'h4')
    },
    NAME_CARD_TITLE
)

// --- Main component ---

// @vue/component
export const BCardTitle = /*#__PURE__*/ defineComponent({
    name: NAME_CARD_TITLE,
    props,
    render(h, { props, data, children }) {
        return h(
            props.titleTag,
            mergeData(data, {
                class: 'card-title'
            }),
            children || toString(props.title)
        )
    }
})