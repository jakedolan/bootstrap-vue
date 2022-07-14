import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_CARD_TEXT } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        textTag: makeProp(PROP_TYPE_STRING, 'p')
    },
    NAME_CARD_TEXT
)

// --- Main component ---

// @vue/component
export const BCardText = /*#__PURE__*/ defineComponent({
    name: NAME_CARD_TEXT,
    functional: true,
    props,
    render(h, { props, data, children }) {
        return h(props.textTag, mergeData(data, { class: 'card-text' }), children)
    }
})