import { defineComponent, h } from 'vue'
import { SLOT_NAME_TOP_ROW } from '../../../constants/slots'
import { isFunction } from '../../../utils/inspect'
import { BTr } from '../tr'

// --- Props ---

export const props = {}

// --- Mixin ---

// @vue/component
export const topRowMixin = defineComponent({
    methods: {
        renderTopRow() {
            const { computedFields: fields, stacked, tbodyTrClass, tbodyTrAttr } = this

            // Add static Top Row slot (hidden in visibly stacked mode as we can't control the data-label)
            // If in *always* stacked mode, we don't bother rendering the row
            if (!this.hasNormalizedSlot(SLOT_NAME_TOP_ROW) || stacked === true || stacked === '') {
                return h()
            }

            return h(
                BTr, {
                    class: ['b-table-top-row', isFunction(tbodyTrClass) ? tbodyTrClass(null, 'row-top') : tbodyTrClass],
                    ...(isFunction(tbodyTrAttr) ? tbodyTrAttr(null, 'row-top') || {} : tbodyTrAttr || {}),
                    key: 'b-top-row'
                }, [this.normalizeSlot(SLOT_NAME_TOP_ROW, { columns: fields.length, fields })]
            )
        }
    }
})
