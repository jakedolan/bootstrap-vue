import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_CARD_HEADER } from '../../constants/components'
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props'
import { htmlOrText } from '../../utils/html'
import { sortKeys } from '../../utils/object'
import { copyProps, makeProp, makePropsConfigurable, prefixPropName } from '../../utils/props'
import { props as BCardProps } from '../../mixins/card'

// --- Props ---

export const props = makePropsConfigurable(
    sortKeys({
        ...copyProps(BCardProps, prefixPropName.bind(null, 'header')),
        header: makeProp(PROP_TYPE_STRING),
        headerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        headerHtml: makeProp(PROP_TYPE_STRING)
    }),
    NAME_CARD_HEADER
)

// --- Main component ---

// @vue/component
export const BCardHeader = /*#__PURE__*/ defineComponent({
    name: NAME_CARD_HEADER,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        const { headerBgVariant, headerBorderVariant, headerTextVariant } = props

        // TODO: Review Children's use here. Temp creating children = {};
        const children = {};

        return h(
            props.headerTag,
            mergeData(data, {
                class: ['card-header',
                    props.headerClass,
                    {
                        [`bg-${headerBgVariant}`]: headerBgVariant,
                        [`border-${headerBorderVariant}`]: headerBorderVariant,
                        [`text-${headerTextVariant}`]: headerTextVariant
                    }
                ],
                ...(children ? {} : htmlOrText(props.headerHtml, props.header))
            }),
            slots
        )
    }
})
