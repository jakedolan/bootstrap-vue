import { defineComponent, h } from 'vue'
import { NAME_DROPDOWN_ITEM_BUTTON } from '../../constants/components'
import { EVENT_NAME_CLICK } from '../../constants/events'
import {
    PROP_TYPE_ARRAY_OBJECT_STRING,
    PROP_TYPE_BOOLEAN,
    PROP_TYPE_STRING
} from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { attrsMixin } from '../../mixins/attrs'
import { normalizeSlotMixin } from '../../mixins/normalize-slot'

// --- Props ---

export const props = makePropsConfigurable({
        active: makeProp(PROP_TYPE_BOOLEAN, false),
        activeClass: makeProp(PROP_TYPE_STRING, 'active'),
        buttonClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        disabled: makeProp(PROP_TYPE_BOOLEAN, false),
        variant: makeProp(PROP_TYPE_STRING)
    },
    NAME_DROPDOWN_ITEM_BUTTON
)

// --- Main component ---

// @vue/component
export const BDropdownItemButton = /*#__PURE__*/ defineComponent({
    name: NAME_DROPDOWN_ITEM_BUTTON,
    mixins: [attrsMixin, normalizeSlotMixin],
    inject: {
        getBvDropdown: { default: () => () => null }
    },
    inheritAttrs: false,
    props,
    emits: [EVENT_NAME_CLICK],
    computed: {
        bvDropdown() {
            return this.getBvDropdown()
        },

        computedAttrs() {
            return {
                ...this.bvAttrs,
                role: 'menuitem',
                type: 'button',
                disabled: this.disabled
            }
        }
    },
    methods: {
        closeDropdown() {
            if (this.bvDropdown) {
                this.bvDropdown.hide(true)
            }
        },
        onClick(event) {
            this.$emit(EVENT_NAME_CLICK, event)
            this.closeDropdown()
        }
    },
    render() {
        const { active, variant, bvAttrs } = this

        return h(
            'li', {
                class: bvAttrs.class,
                role: 'presentation',
                style: bvAttrs.style,
            }, [
                h(
                    'button', {
                        class: [
                            'dropdown-item',
                            this.buttonClass,
                            {
                                [this.activeClass]: active,
                                [`text-${variant}`]: variant && !(active || this.disabled)
                            }
                        ],
                        ...this.computedAttrs,
                        onClick: this.onClick,
                        ref: 'button'
                    },
                    this.normalizeSlot()
                )
            ]
        )
    }
})