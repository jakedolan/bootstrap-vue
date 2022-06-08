import { defineComponent } from 'vue'
import { SLOT_NAME_DEFAULT } from '../constants/slots'
import { hasNormalizedSlot, normalizeSlot } from '../utils/normalize-slot'
import { concat } from '../utils/array'

// @vue/component
export const normalizeSlotMixin = defineComponent({
    compatConfig: {
        MODE: 3,
        INSTANCE_SCOPED_SLOTS: 'suppress-warning'
    },
    methods: {
        // Returns `true` if the either a ` or `$slot` exists with the specified name
        // `name` can be a string name or an array of names
        hasNormalizedSlot(
            name = SLOT_NAME_DEFAULT,
            slots = this.$slots
        ) {
            return hasNormalizedSlot(name, slots)
        },
        // Returns an array of rendered VNodes if slot found, otherwise `undefined`
        // `name` can be a string name or an array of names
        normalizeSlot(
            name = SLOT_NAME_DEFAULT,
            scope = {},
            slots = this.$slots
        ) {
            const vNodes = normalizeSlot(name, scope, slots)
            return vNodes ? concat(vNodes) : vNodes
        }
    }
})