import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_CARD_GROUP } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        columns: makeProp(PROP_TYPE_BOOLEAN, false),
        deck: makeProp(PROP_TYPE_BOOLEAN, false),
        tag: makeProp(PROP_TYPE_STRING, 'div')
    },
    NAME_CARD_GROUP
)

// --- Main component ---

// @vue/component
export const BCardGroup = /*#__PURE__*/ defineComponent({
    name: NAME_CARD_GROUP,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        return h(
            props.tag,
            mergeData({
                class: [props.deck ? 'card-deck' : props.columns ? 'card-columns' : 'card-group', data.attrs ? data.attrs.class : {}],
            }, data), slots)
    }
})
