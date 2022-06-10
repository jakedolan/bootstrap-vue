import { defineComponent, h } from 'vue'
import { NAME_FORM_TAG } from '../../constants/components'
import { EVENT_NAME_REMOVE } from '../../constants/events'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { CODE_DELETE } from '../../constants/key-codes'
import { sortKeys } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { idMixin, props as idProps } from '../../mixins/id'
import { normalizeSlotMixin } from '../../mixins/normalize-slot'
import { BBadge } from '../badge/badge'
import { BButtonClose } from '../button/button-close'

// --- Props ---

export const props = makePropsConfigurable(
    sortKeys({
        ...idProps,
        disabled: makeProp(PROP_TYPE_BOOLEAN, false),
        noRemove: makeProp(PROP_TYPE_BOOLEAN, false),
        pill: makeProp(PROP_TYPE_BOOLEAN, false),
        removeLabel: makeProp(PROP_TYPE_STRING, 'Remove tag'),
        tag: makeProp(PROP_TYPE_STRING, 'span'),
        title: makeProp(PROP_TYPE_STRING),
        variant: makeProp(PROP_TYPE_STRING, 'secondary')
    }),
    NAME_FORM_TAG
)

// --- Main component ---

// @vue/component
export const BFormTag = /*#__PURE__*/ defineComponent({
    name: NAME_FORM_TAG,
    mixins: [idMixin, normalizeSlotMixin],
    props,
    methods: {
        onRemove(event) {
            const { type, keyCode } = event
            if (!this.disabled && (type === 'click' || (type === 'keydown' && keyCode === CODE_DELETE))) {
                this.$emit(EVENT_NAME_REMOVE)
            }
        }
    },
    render() {
        const { title, tag, variant, pill, disabled } = this
        const tagId = this.safeId()
        const tagLabelId = this.safeId('_taglabel_')

        let $remove = null
        if (!this.noRemove && !disabled) {
            $remove = h(BButtonClose, {
                class: 'b-form-tag-remove',
                ariaLabel: this.removeLabel,
                'aria-controls': tagId,
                'aria-describedby': tagLabelId,
                'aria-keyshortcuts': 'Delete',
                onClick: this.onRemove,
                onKeydown: this.onRemove
            })
        }

        const $tag = h(
            'span', {
                class: 'b-form-tag-content flex-grow-1 text-truncate',
                id: tagLabelId
            },
            this.normalizeSlot() || title
        )

        return h(
            BBadge, {
                class: ['b-form-tag d-inline-flex align-items-baseline mw-100', { disabled }],
                tag,
                variant,
                pill,
                id: tagId,
                title: title || null,
                'aria-labelledby': tagLabelId,
            }, [$tag, $remove]
        )
    }
})