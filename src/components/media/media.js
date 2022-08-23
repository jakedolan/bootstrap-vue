import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_MEDIA } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { SLOT_NAME_ASIDE, SLOT_NAME_DEFAULT } from '../../constants/slots'
import { normalizeSlot } from '../../utils/normalize-slot'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { BMediaAside } from './media-aside'
import { BMediaBody } from './media-body'

// --- Props ---

export const props = makePropsConfigurable({
        noBody: makeProp(PROP_TYPE_BOOLEAN, false),
        rightAlign: makeProp(PROP_TYPE_BOOLEAN, false),
        tag: makeProp(PROP_TYPE_STRING, 'div'),
        verticalAlign: makeProp(PROP_TYPE_STRING, 'top')
    },
    NAME_MEDIA
)

// --- Main component ---

// @vue/component
export const BMedia = /*#__PURE__*/ defineComponent({
    name: NAME_MEDIA,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        const { noBody, rightAlign, verticalAlign } = props

        // TODO: Review children adn scopedSlots use here. Temp creating objects;
        const children = {};
        const scopedSlots = {};

        const $children = noBody ? children : []

        if (!noBody) {
            const slotScope = {}
            const $slots = slots()
            const $scopedSlots = scopedSlots || {}

            $children.push(
                h(BMediaBody, normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $scopedSlots, $slots))
            )

            const $aside = normalizeSlot(SLOT_NAME_ASIDE, slotScope, $scopedSlots, $slots)
            if ($aside) {
                $children[rightAlign ? 'push' : 'unshift'](
                    h(BMediaAside, { right: rightAlign, verticalAlign }, $aside)
                )
            }
        }

        return h(props.tag, mergeData(data, { class: 'media' }), $children)
    }
})
