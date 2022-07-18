//
// Private component used by `b-form-datepicker` and `b-form-timepicker`
//
import { defineComponent, h, withDirectives } from 'vue'
import { NAME_FORM_BUTTON_LABEL_CONTROL } from '../../constants/components'
import {
    PROP_TYPE_ARRAY_OBJECT_STRING,
    PROP_TYPE_BOOLEAN,
    PROP_TYPE_OBJECT,
    PROP_TYPE_STRING
} from '../../constants/props'
import { SLOT_NAME_BUTTON_CONTENT, SLOT_NAME_DEFAULT } from '../../constants/slots'
import { attemptBlur, attemptFocus } from '../../utils/dom'
import { stopEvent } from '../../utils/events'
import { omit, sortKeys } from '../../utils/object'
import { makeProp } from '../../utils/props'
import { toString } from '../../utils/string'
import { dropdownMixin, props as dropdownProps } from '../../mixins/dropdown'
import { props as formControlProps } from '../../mixins/form-control'
import { formSizeMixin, props as formSizeProps } from '../../mixins/form-size'
import { formStateMixin, props as formStateProps } from '../../mixins/form-state'
import { idMixin, props as idProps } from '../../mixins/id'
import { normalizeSlotMixin } from '../../mixins/normalize-slot'
import { VBHover } from '../../directives/hover/hover'
import { BIconChevronDown } from '../../icons/icons'

// --- Props ---

export const props = sortKeys({
    ...idProps,
    ...formSizeProps,
    ...formStateProps,
    ...omit(dropdownProps, ['disabled']),
    ...omit(formControlProps, ['autofocus']),
    // When `true`, renders a `btn-group` wrapper and visually hides the label
    buttonOnly: makeProp(PROP_TYPE_BOOLEAN, false),
    // Applicable in button mode only
    buttonVariant: makeProp(PROP_TYPE_STRING, 'secondary'),

    // Adding custom emitter
    emitter: makeProp(PROP_TYPE_OBJECT, null),
    // This is the value shown in the label
    // Defaults back to `value`
    formattedValue: makeProp(PROP_TYPE_STRING),
    // Value placed in `.sr-only` span inside label when value is present
    labelSelected: makeProp(PROP_TYPE_STRING),
    lang: makeProp(PROP_TYPE_STRING),
    // Extra classes to apply to the `dropdown-menu` div
    menuClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    // This is the value placed on the hidden input when no value selected
    placeholder: makeProp(PROP_TYPE_STRING),
    readonly: makeProp(PROP_TYPE_BOOLEAN, false),
    // Tri-state prop: `true`, `false` or `null`
    rtl: makeProp(PROP_TYPE_BOOLEAN, null),
    value: makeProp(PROP_TYPE_STRING, '')
})

// --- Main component ---

// @vue/component
export const BVFormBtnLabelControl = /*#__PURE__*/ defineComponent({
    name: NAME_FORM_BUTTON_LABEL_CONTROL,
    directives: {
        'b-hover': VBHover
    },
    mixins: [idMixin, formSizeMixin, formStateMixin, dropdownMixin, normalizeSlotMixin],
    props,
    data() {
        return {
            isHovered: false,
            hasFocus: false
        }
    },
    computed: {
        idButton() {
            return this.safeId()
        },
        idLabel() {
            return this.safeId('_value_')
        },
        idMenu() {
            return this.safeId('_dialog_')
        },
        idWrapper() {
            return this.safeId('_outer_')
        },
        computedDir() {
            return this.rtl === true ? 'rtl' : this.rtl === false ? 'ltr' : null
        }
    },
    methods: {
        focus() {
            if (!this.disabled) {
                attemptFocus(this.$refs.toggle)
            }
        },
        blur() {
            if (!this.disabled) {
                attemptBlur(this.$refs.toggle)
            }
        },
        setFocus(event) {
            this.hasFocus = event.type === 'focus'
        },
        handleHover(hovered) {
            this.isHovered = hovered
        }
    },
    render() {
        const {
            idButton,
            idLabel,
            idMenu,
            idWrapper,
            disabled,
            readonly,
            required,
            name,
            state,
            visible,
            size,
            isHovered,
            hasFocus,
            labelSelected,
            buttonVariant,
            buttonOnly
        } = this
        const value = toString(this.value) || ''
        const invalid = state === false || (required && !value)

        const btnScope = { isHovered, hasFocus, state, opened: visible }
        const $button = withDirectives(
            h(
              'button', {
                  class: ['btn', {
                      [`btn-${buttonVariant}`]: buttonOnly,
                      [`btn-${size}`]: size,
                      'h-auto': !buttonOnly,
                      // `dropdown-toggle` is needed for proper
                      // corner rounding in button only mode
                      'dropdown-toggle': buttonOnly,
                      'dropdown-toggle-no-caret': buttonOnly
                  }],
                  id: idButton,
                  type: 'button',
                  disabled,
                  'aria-haspopup': 'dialog',
                  'aria-expanded': visible ? 'true' : 'false',
                  'aria-invalid': invalid ? 'true' : null,
                  'aria-required': required ? 'true' : null,
                  onMousedown: this.onMousedown,
                  onClick: this.toggle,
                  // Handle ENTER, SPACE and DOWN
                  onKeydown: this.toggle, 
                  // We use capture phase (`!` prefix) since focus and blur do not bubble
                  // '!onFocus': this.setFocus,
                  // '!onBlur': this.setFocus,
                  onBlur: this.setFocus,
                  onFocus: this.setFocus,
                  ref: 'toggle'
              }, {
                default: () => [
                  this.hasNormalizedSlot(SLOT_NAME_BUTTON_CONTENT) ?
                  this.normalizeSlot(SLOT_NAME_BUTTON_CONTENT, btnScope) :
                  /* istanbul ignore next */
                  h(BIconChevronDown, { scale: 1.25 })
                 ]
              }
            ), 
            [['b-hover', this.handleHover]])

        // Hidden input
        let $hidden = null
        if (name && !disabled) {
            $hidden = h('input', {
                type: 'hidden',
                name: name || null,
                form: this.form || null,
                value
            })
        }

        // Dropdown content
        const $menu = h(
            'div', {
                class: ['dropdown-menu',
                    this.menuClass,
                    {
                        show: visible,
                        'dropdown-menu-right': this.right
                    }
                ],
                id: idMenu,
                role: 'dialog',
                tabindex: '-1',
                'aria-modal': 'false',
                'aria-labelledby': idLabel,
                 // Handle ESC
                onKeydown: this.onKeydown,
                ref: 'menu'
            }, {
              default: () => [this.normalizeSlot(SLOT_NAME_DEFAULT, { opened: visible })]
            }
        )

        // Value label
        const $label = withDirectives(
            h(
                'label', {
                    class: buttonOnly ?
                        'sr-only' // Hidden in button only mode
                        :
                        [
                            'form-control',
                            // Mute the text if showing the placeholder
                            { 'text-muted': !value },
                            this.stateClass,
                            this.sizeFormClass
                        ],
                    id: idLabel,
                    for: idButton,
                    'aria-invalid': invalid ? 'true' : null,
                    'aria-required': required ? 'true' : null,
                    // Disable bubbling of the click event to
                    // prevent menu from closing and re-opening
                    onClick: /* istanbul ignore next */ event => {
                        stopEvent(event, { preventDefault: false })
                    }
                }, {
                  default: () => [
                    value ? this.formattedValue || value : this.placeholder || '',
                    // Add the selected label for screen readers when a value is provided
                    value && labelSelected ? h('bdi', { class: 'sr-only' }, labelSelected) : ''
                  ]
                }
            ), 
            [['b-hover', this.handleHover]])

        // Return the custom form control wrapper
        return h(
            'div', {
                class: ['b-form-btn-label-control dropdown',
                            this.directionClass,
                            this.boundaryClass, {
                            'btn-group': buttonOnly,
                            'form-control': !buttonOnly,
                            focus: hasFocus && !buttonOnly,
                            show: visible,
                            'is-valid': state === true,
                            'is-invalid': state === false
                        },
                        buttonOnly ? null : this.sizeFormClass
                ],
                id: idWrapper,
                role: buttonOnly ? null : 'group',
                lang: this.lang || null,
                dir: this.computedDir,
                'aria-disabled': disabled,
                'aria-readonly': readonly && !disabled,
                'aria-labelledby': idLabel,
                'aria-invalid': state === false || (required && !value) ? 'true' : null,
                'aria-required': required ? 'true' : null
            }, {
              default: () => [$button, $hidden, $menu, $label]
            }
        )
    }
})