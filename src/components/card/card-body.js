import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_CARD_BODY } from '../../constants/components'
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN } from '../../constants/props'
import { sortKeys } from '../../utils/object'
import {
    copyProps,
    makeProp,
    makePropsConfigurable,
    pluckProps,
    prefixPropName
} from '../../utils/props'
import { props as cardProps } from '../../mixins/card'
import { BCardTitle, props as titleProps } from './card-title'
import { BCardSubTitle, props as subTitleProps } from './card-sub-title'

// --- Props ---

export const props = makePropsConfigurable(
    sortKeys({
        ...titleProps,
        ...subTitleProps,
        ...copyProps(cardProps, prefixPropName.bind(null, 'body')),
        bodyClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        overlay: makeProp(PROP_TYPE_BOOLEAN, false)
    }),
    NAME_CARD_BODY
)

// --- Main component ---

// @vue/component
export const BCardBody = /*#__PURE__*/ defineComponent({
    name: NAME_CARD_BODY,
    props,
    render(h, { props, data, children }) {
        const { bodyBgVariant, bodyBorderVariant, bodyTextVariant } = props

        let $title = h()
        if (props.title) {
            $title = h(BCardTitle, {...pluckProps(titleProps, props) })
        }

        let $subTitle = h()
        if (props.subTitle) {
            $subTitle = h(BCardSubTitle, {
                ...pluckProps(subTitleProps, props),
                class: ['mb-2']
            })
        }

        return h(
            props.bodyTag,
            mergeData(data, {
                class: [
                    'card-body',
                    {
                        'card-img-overlay': props.overlay,
                        [`bg-${bodyBgVariant}`]: bodyBgVariant,
                        [`border-${bodyBorderVariant}`]: bodyBorderVariant,
                        [`text-${bodyTextVariant}`]: bodyTextVariant
                    },
                    props.bodyClass
                ]
            }), [$title, $subTitle, children]
        )
    }
})