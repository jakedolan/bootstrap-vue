import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_CARD } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { SLOT_NAME_DEFAULT, SLOT_NAME_FOOTER, SLOT_NAME_HEADER } from '../../constants/slots'
import { htmlOrText } from '../../utils/html'
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot'
import { sortKeys } from '../../utils/object'
import {
    copyProps,
    makeProp,
    makePropsConfigurable,
    pluckProps,
    prefixPropName,
    unprefixPropName
} from '../../utils/props'
import { props as cardProps } from '../../mixins/card'
import { BCardBody, props as BCardBodyProps } from './card-body'
import { BCardHeader, props as BCardHeaderProps } from './card-header'
import { BCardFooter, props as BCardFooterProps } from './card-footer'
import { BCardImg, props as BCardImgProps } from './card-img'

// --- Props ---

const cardImgProps = copyProps(BCardImgProps, prefixPropName.bind(null, 'img'))
cardImgProps.imgSrc.required = false

export const props = makePropsConfigurable(
    sortKeys({
        ...BCardBodyProps,
        ...BCardHeaderProps,
        ...BCardFooterProps,
        ...cardImgProps,
        ...cardProps,
        align: makeProp(PROP_TYPE_STRING),
        noBody: makeProp(PROP_TYPE_BOOLEAN, false)
    }),
    NAME_CARD
)

// --- Main component ---

// @vue/component
export const BCard = /*#__PURE__*/ defineComponent({
    name: NAME_CARD,
    compatConfig: {
        MODE: 3,
        INSTANCE_SCOPED_SLOTS: 'suppress-warning'
    },
    functional: true,
    props,
    render() {
        const { $props, $data, $slots } = this;
        const {
            imgSrc,
            imgLeft,
            imgRight,
            imgStart,
            imgEnd,
            imgBottom,
            header,
            headerHtml,
            footer,
            footerHtml,
            align,
            textVariant,
            bgVariant,
            borderVariant
        } = $props
        const slotScope = {}

        let $imgFirst = h()
        let $imgLast = h()
        if (imgSrc) {
            const $img = h(BCardImg, {
                ...pluckProps(cardImgProps, $props, unprefixPropName.bind(null, 'img'))
            })

            if (imgBottom) {
                $imgLast = $img
            } else {
                $imgFirst = $img
            }
        }

        let $header = h()
        const hasHeaderSlot = hasNormalizedSlot(SLOT_NAME_HEADER, $slots)
        if (hasHeaderSlot || header || headerHtml) {
            $header = h(
                BCardHeader, {
                    ...pluckProps(BCardHeaderProps, $props),
                    ...(hasHeaderSlot ? {} : htmlOrText(headerHtml, header))
                },
                normalizeSlot(SLOT_NAME_HEADER, slotScope, $slots)
            )
        }

        let $content = normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $slots)

        // Wrap content in `<card-body>` when `noBody` prop set
        if (!$props.noBody) {
            $content = h(BCardBody, { ...pluckProps(BCardBodyProps, $props) }, $content)

            // When the `overlap` prop is set we need to wrap the `<b-card-img>` and `<b-card-body>`
            // into a relative positioned wrapper to don't distract a potential header or footer
            if ($props.overlay && imgSrc) {
                $content = h('div', { class: 'position-relative' }, [$imgFirst, $content, $imgLast])
                    // Reset image variables since they are already in the wrapper
                $imgFirst = h()
                $imgLast = h()
            }
        }

        let $footer = h()
        const hasFooterSlot = hasNormalizedSlot(SLOT_NAME_FOOTER, $slots)
        if (hasFooterSlot || footer || footerHtml) {
            $footer = h(
                BCardFooter, {
                    ...pluckProps(BCardFooterProps, $props),
                    ...(hasHeaderSlot ? {} : htmlOrText(footerHtml, footer))
                },
                normalizeSlot(SLOT_NAME_FOOTER, slotScope, $slots)
            )
        }

        return h(
            $props.tag,
            mergeData(data, {
                class: ['card', {
                    'flex-row': imgLeft || imgStart,
                        'flex-row-reverse': (imgRight || imgEnd) && !(imgLeft || imgStart), [`text-${align}`]: align, [`bg-${bgVariant}`]: bgVariant, [`border-${borderVariant}`]: borderVariant, [`text-${textVariant}`]: textVariant
                }]
            }), [$imgFirst, $header, $content, $footer, $imgLast]
        )
    }
})