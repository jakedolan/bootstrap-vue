import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_JUMBOTRON } from '../../constants/components'
import {
    PROP_TYPE_BOOLEAN,
    PROP_TYPE_BOOLEAN_STRING,
    PROP_TYPE_NUMBER_STRING,
    PROP_TYPE_STRING
} from '../../constants/props'
import { SLOT_NAME_DEFAULT, SLOT_NAME_HEADER, SLOT_NAME_LEAD } from '../../constants/slots'
import { htmlOrText } from '../../utils/html'
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { BContainer } from '../layout/container'

// --- Props ---

export const props = makePropsConfigurable({
        bgVariant: makeProp(PROP_TYPE_STRING),
        borderVariant: makeProp(PROP_TYPE_STRING),
        containerFluid: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
        fluid: makeProp(PROP_TYPE_BOOLEAN, false),
        header: makeProp(PROP_TYPE_STRING),
        headerHtml: makeProp(PROP_TYPE_STRING),
        headerLevel: makeProp(PROP_TYPE_NUMBER_STRING, 3),
        headerTag: makeProp(PROP_TYPE_STRING, 'h1'),
        lead: makeProp(PROP_TYPE_STRING),
        leadHtml: makeProp(PROP_TYPE_STRING),
        leadTag: makeProp(PROP_TYPE_STRING, 'p'),
        tag: makeProp(PROP_TYPE_STRING, 'div'),
        textVariant: makeProp(PROP_TYPE_STRING)
    },
    NAME_JUMBOTRON
)

// --- Main component ---

// @vue/component
export const BJumbotron = /*#__PURE__*/ defineComponent({
    name: NAME_JUMBOTRON,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        const { header, headerHtml, lead, leadHtml, textVariant, bgVariant, borderVariant } = props

        // TODO: Review scopedSlots use here. Temp creating scopedSlots = {};
        const scopedSlots = {};

        const $scopedSlots = scopedSlots || {}
        const $slots = slots()
        const slotScope = {}

        let $header = h()
        const hasHeaderSlot = hasNormalizedSlot(SLOT_NAME_HEADER, $scopedSlots, $slots)
        if (hasHeaderSlot || header || headerHtml) {
            const { headerLevel } = props

            $header = h(
                props.headerTag, {
                    class: {
                        [`display-${headerLevel}`]: headerLevel
                    },
                    ...(hasHeaderSlot ? {} : htmlOrText(headerHtml, header))
                },
                normalizeSlot(SLOT_NAME_HEADER, slotScope, $scopedSlots, $slots)
            )
        }

        let $lead = h()
        const hasLeadSlot = hasNormalizedSlot(SLOT_NAME_LEAD, $scopedSlots, $slots)
        if (hasLeadSlot || lead || leadHtml) {
            $lead = h(
                props.leadTag, {
                    class: 'lead',
                    ...(hasLeadSlot ? {} : htmlOrText(leadHtml, lead))
                },
                normalizeSlot(SLOT_NAME_LEAD, slotScope, $scopedSlots, $slots)
            )
        }

        let $children = [
            $header,
            $lead,
            normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $scopedSlots, $slots)
        ]

        // If fluid, wrap content in a container
        if (props.fluid) {
            $children = [h(BContainer, { fluid: props.containerFluid }, $children)]
        }

        return h(
            props.tag,
            mergeData(data, {
                class: ['jumbotron',
                    {
                        'jumbotron-fluid': props.fluid,
                        [`text-${textVariant}`]: textVariant,
                        [`bg-${bgVariant}`]: bgVariant,
                        [`border-${borderVariant}`]: borderVariant,
                        border: borderVariant
                    }
                ]
            }),
            $children
        )
    }
})
