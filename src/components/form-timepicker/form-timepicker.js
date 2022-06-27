import { defineComponent, h } from 'vue'
import { NAME_FORM_TIMEPICKER } from '../../constants/components'
import { EVENT_NAME_CONTEXT, EVENT_NAME_SHOWN, EVENT_NAME_HIDDEN } from '../../constants/events'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_DATE_STRING, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props'
import { SLOT_NAME_BUTTON_CONTENT } from '../../constants/slots'
import { attemptBlur, attemptFocus } from '../../utils/dom'
import { isUndefinedOrNull } from '../../utils/inspect'
import { makeModelMixin } from '../../utils/model'
import { omit, sortKeys } from '../../utils/object'
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props'
import { idMixin, props as idProps } from '../../mixins/id'
import { BIconClock, BIconClockFill } from '../../icons/icons'
import { BButton } from '../button/button'
import {
    BVFormBtnLabelControl,
    props as BVFormBtnLabelControlProps
} from '../form-btn-label-control/bv-form-btn-label-control'
import { BTime, props as BTimeProps } from '../time/time'

// --- Constants ---

const {
    mixin: modelMixin,
    props: modelProps,
    prop: MODEL_PROP_NAME,
    event: MODEL_EVENT_NAME
} = makeModelMixin('value', {
    type: PROP_TYPE_STRING,
    defaultValue: ''
})

// --- Props ---

const timeProps = omit(BTimeProps, ['hidden', 'id', 'value'])

const formBtnLabelControlProps = omit(BVFormBtnLabelControlProps, [
    'formattedValue',
    'id',
    'lang',
    'rtl',
    'value'
])

export const props = makePropsConfigurable(
    sortKeys({
        ...idProps,
        ...modelProps,
        ...timeProps,
        ...formBtnLabelControlProps,
        closeButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-secondary'),

        // Adding custom emitter
        emitter: makeProp(PROP_TYPE_OBJECT, null),
        labelCloseButton: makeProp(PROP_TYPE_STRING, 'Close'),
        labelNowButton: makeProp(PROP_TYPE_STRING, 'Select now'),
        labelResetButton: makeProp(PROP_TYPE_STRING, 'Reset'),
        noCloseButton: makeProp(PROP_TYPE_BOOLEAN, false),
        nowButton: makeProp(PROP_TYPE_BOOLEAN, false),
        nowButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-primary'),
        resetButton: makeProp(PROP_TYPE_BOOLEAN, false),
        resetButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-danger'),
        resetValue: makeProp(PROP_TYPE_DATE_STRING)
    }),
    NAME_FORM_TIMEPICKER
)

// --- Main component ---

// @vue/component
export const BFormTimepicker = /*#__PURE__*/ defineComponent({
    name: NAME_FORM_TIMEPICKER,
    compatConfig: {
        MODE: 3,
        INSTANCE_SCOPED_SLOTS: 'suppress-warning'
    },
    mixins: [idMixin, modelMixin],
    props,
    emits: [EVENT_NAME_CONTEXT, EVENT_NAME_HIDDEN, EVENT_NAME_SHOWN, MODEL_EVENT_NAME],
    data() {
        return {
            // We always use `HH:mm:ss` value internally
            localHMS: this[MODEL_PROP_NAME] || '',
            // Context data from BTime
            localLocale: null,
            isRTL: false,
            formattedValue: '',
            // If the menu is opened
            isVisible: false
        }
    },
    computed: {
        computedLang() {
            return (this.localLocale || '').replace(/-u-.*$/i, '') || null
        }
    },
    watch: {
        [MODEL_PROP_NAME](newValue) {
            this.localHMS = newValue || ''
        },
        localHMS(newValue) {
            // We only update the v-model value when the timepicker
            // is open, to prevent cursor jumps when bound to a
            // text input in button only mode
            if (this.isVisible) {
                this.$emit(MODEL_EVENT_NAME, newValue || '')
            }
        }
    },
    methods: {
        // Public methods
        focus() {
            if (!this.disabled) {
                attemptFocus(this.$refs.control)
            }
        },
        blur() {
            if (!this.disabled) {
                attemptBlur(this.$refs.control)
            }
        },
        // Private methods
        setAndClose(value) {
            this.localHMS = value
            this.$nextTick(() => {
                this.$refs.control.hide(true)
            })
        },
        onInput(hms) {
            if (this.localHMS !== hms) {
                this.localHMS = hms
            }
        },
        onContext(ctx) {
            const { isRTL, locale, value, formatted } = ctx
            this.isRTL = isRTL
            this.localLocale = locale
            this.formattedValue = formatted
            this.localHMS = value || ''
                // Re-emit the context event
            this.$emit(EVENT_NAME_CONTEXT, ctx)
        },
        onNowButton() {
            const now = new Date()
            const hours = now.getHours()
            const minutes = now.getMinutes()
            const seconds = this.showSeconds ? now.getSeconds() : 0
            const value = [hours, minutes, seconds].map(v => `00${v || ''}`.slice(-2)).join(':')
            this.setAndClose(value)
        },
        onResetButton() {
            this.setAndClose(this.resetValue)
        },
        onCloseButton() {
            this.$refs.control.hide(true)
        },
        onShow() {
            this.isVisible = true
        },
        onShown() {
            this.$nextTick(() => {
                attemptFocus(this.$refs.time)
                this.$emit(EVENT_NAME_SHOWN)
            })
        },
        onHidden() {
            this.isVisible = false
            this.$emit(EVENT_NAME_HIDDEN)
        },
        // Render function helpers
        defaultButtonFn({ isHovered, hasFocus }) {
            return h(isHovered || hasFocus ? BIconClockFill : BIconClock, {
                'aria-hidden': 'true'
            })
        }
    },
    render() {
        const { localHMS, disabled, readonly, $props, $slots } = this
        const placeholder = isUndefinedOrNull(this.placeholder) ?
            this.labelNoTimeSelected :
            this.placeholder

        // Footer buttons
        let $footer = []

        if (this.nowButton) {
            const label = this.labelNowButton
            $footer.push(
                h(
                    BButton, {
                        size: 'sm',
                        disabled: disabled || readonly,
                        variant: this.nowButtonVariant,
                        'aria-label': label || null,
                        onClick: this.onNowButton,
                        key: 'now-btn'
                    },
                    { default: () => [label] }
                )
            )
        }

        if (this.resetButton) {
            if ($footer.length > 0) {
                // Add a "spacer" between buttons ('&nbsp;')
                $footer.push(h('span', '\u00a0'))
            }
            const label = this.labelResetButton
            $footer.push(
                h(
                    BButton, {
                        size: 'sm',
                        disabled: disabled || readonly,
                        variant: this.resetButtonVariant,
                        'aria-label': label || null,
                        onClick: this.onResetButton,
                        key: 'reset-btn'
                    },
                    { default: () => [label] }
                )
            )
        }

        if (!this.noCloseButton) {
            // Add a "spacer" between buttons ('&nbsp;')
            if ($footer.length > 0) {
                $footer.push(h('span', '\u00a0'))
            }

            const label = this.labelCloseButton

            $footer.push(
                h(
                    BButton, {
                        size: 'sm',
                        disabled,
                        variant: this.closeButtonVariant,
                        'aria-label': label || null,
                        onClick: this.onCloseButton,
                        key: 'close-btn'
                    },
                    { default: () => label }
                )
            )
        }

        if ($footer.length > 0) {
            $footer = [
                h(
                    'div', {
                        class: ['b-form-date-controls d-flex flex-wrap', {
                            'justify-content-between': $footer.length > 1,
                                'justify-content-end': $footer.length < 2
                        }]
                    },
                    { default: () => [$footer] }
                )
            ]
        }

        const $time = h(
            BTime, {
                class: ['b-form-time-control'],
                ...pluckProps(timeProps, $props),
                value: localHMS,
                hidden: !this.isVisible,
                emitter: this.emitter,
            
                onInput: this.onInput,
                onContext: this.onContext,
                ref: 'time'
            },
            { default: () => $footer }
        )

        return h(
            BVFormBtnLabelControl, {
                class: ['b-form-timepicker'],
                ...pluckProps(formBtnLabelControlProps, $props),
                id: this.safeId(),
                value: localHMS,
                emitter: this.emitter,
                formattedValue: localHMS ? this.formattedValue : '',
                placeholder,
                rtl: this.isRTL,
                lang: this.computedLang,
                onShow: this.onShow,
                onShown: this.onShown,
                onHidden: this.onHidden,
                ref: 'control'
            }, {
              default: () => [$time],
              [SLOT_NAME_BUTTON_CONTENT]: () => $slots[SLOT_NAME_BUTTON_CONTENT] || h(BIconClock, {
                'aria-hidden': 'true'
                })
            }
        )
    }
})