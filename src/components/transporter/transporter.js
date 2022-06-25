import { defineComponent, h, Teleport } from 'vue'
import { NAME_TRANSPORTER } from '../../constants/components'
import {
    PROP_TYPE_BOOLEAN,
    PROP_TYPE_STRING
} from '../../constants/props'
import { HTMLElement } from '../../constants/safe-types'
import { concat } from '../../utils/array'
import { identity } from '../../utils/identity'
import { normalizeSlotMixin } from '../../mixins/normalize-slot'
import { makeProp } from '../../utils/props'


// --- Props ---
export const props = {
    // String: CSS selector,
    // HTMLElement: Element reference
    // Mainly needed for tooltips/popovers inside modals
    container: makeProp([HTMLElement, PROP_TYPE_STRING], 'body'),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    // This should be set to match the root element type
    tag: makeProp(PROP_TYPE_STRING, 'div')
}

// --- Main component ---


export const BVTransporter = /*#__PURE__*/ defineComponent({
    name: NAME_TRANSPORTER,
    mixins: [normalizeSlotMixin],
    props,
    render() {
        if (this.disabled) {
            const $nodes = concat(this.normalizeSlot()).filter(identity)
            if ($nodes.length > 0) {
                return $nodes[0]
            }
        }
        return h(Teleport, {
                to: this.container
            },
            { default: () => this.normalizeSlot() }
        )
    }
})