import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_DROPDOWN_GROUP } from '../../constants/components'
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props'
import { SLOT_NAME_DEFAULT, SLOT_NAME_HEADER } from '../../constants/slots'
import { isTag } from '../../utils/dom'
import { identity } from '../../utils/identity'
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot'
import { omit } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        ariaDescribedby: makeProp(PROP_TYPE_STRING),
        header: makeProp(PROP_TYPE_STRING),
        headerClasses: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        headerTag: makeProp(PROP_TYPE_STRING, 'header'),
        headerVariant: makeProp(PROP_TYPE_STRING),
        id: makeProp(PROP_TYPE_STRING)
    },
    NAME_DROPDOWN_GROUP
)

// --- Main component ---

// @vue/component
export const BDropdownGroup = /*#__PURE__*/ defineComponent({
    name: NAME_DROPDOWN_GROUP,
    compatConfig: {
        MODE: 3,
        INSTANCE_SCOPED_SLOTS: 'suppress-warning'
    },
    functional: true,
    props,
    render() {
        const { $props, $data, $slots } = this;
        const { id, variant, header, headerTag } = $props
        const slotScope = {}
        const headerId = id ? `_bv_${id}_group_dd_header` : null

        let $header = null
        if (hasNormalizedSlot(SLOT_NAME_HEADER, $slots) || header) {
            $header = h(
                headerTag, {
                    class: ['dropdown-header',$props.headerClasses, {
                        [`text-${variant}`]: variant }],
                    id: headerId,
                    role: isTag(headerTag, 'header') ? null : 'heading'
                },
                normalizeSlot(SLOT_NAME_HEADER, slotScope, $slots) || header
            )
        }

        return h('li', mergeData(omit($data, ['attrs']), { role: 'presentation' }), [
            $header,
            h(
                'ul', {
                    class: 'list-unstyled',
                    ...($data.attrs || {}),
                    id,
                    role: 'group',
                    'aria-describedby': [headerId, $props.ariaDescribedBy]
                        .filter(identity)
                        .join(' ')
                        .trim() || null
                    
                },
                normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $slots)
            )
        ])
    }
})