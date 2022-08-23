import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_CARD_SUB_TITLE } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { toString } from '../../utils/string'

// --- Props ---

export const props = makePropsConfigurable({
        subTitle: makeProp(PROP_TYPE_STRING),
        subTitleTag: makeProp(PROP_TYPE_STRING, 'h6'),
        subTitleTextVariant: makeProp(PROP_TYPE_STRING, 'muted')
    },
    NAME_CARD_SUB_TITLE
)

// --- Main component ---

// @vue/component
export const BCardSubTitle = /*#__PURE__*/ defineComponent({
    name: NAME_CARD_SUB_TITLE,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;

        // TODO: Review Children's use here. Temp creating children = {};
        const children = {};

        return h(
            props.subTitleTag,
            mergeData(data, {
                class: ['card-subtitle', props.subTitleTextVariant ? `text-${props.subTitleTextVariant}` : null]
            }),
            children || toString(props.subTitle)
        )
    }
})
