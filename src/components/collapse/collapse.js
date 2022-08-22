import { defineComponent, h, vShow, withDirectives } from 'vue'
import { NAME_COLLAPSE } from '../../constants/components'
import { CLASS_NAME_SHOW } from '../../constants/classes'
import { IS_BROWSER } from '../../constants/env'
import {
    EVENT_NAME_HIDDEN,
    EVENT_NAME_HIDE,
    EVENT_NAME_SHOW,
    EVENT_NAME_SHOWN,
    EVENT_OPTIONS_NO_CAPTURE
} from '../../constants/events'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING, PROP_TYPE_OBJECT } from '../../constants/props'
import { SLOT_NAME_DEFAULT } from '../../constants/slots'
import { addClass, hasClass, removeClass, closest, matches, getById, getCS } from '../../utils/dom'
import { getRootActionEventName, getRootEventName, eventOnOff } from '../../utils/events'
import { makeModelMixin } from '../../utils/model'
import { sortKeys } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { idMixin, props as idProps } from '../../mixins/id'
import { listenOnRootMixin } from '../../mixins/listen-on-root'
import { normalizeSlotMixin } from '../../mixins/normalize-slot'
import { BVCollapse } from './helpers/bv-collapse'

// --- Constants ---

const ROOT_ACTION_EVENT_NAME_TOGGLE = getRootActionEventName(NAME_COLLAPSE, 'toggle')
const ROOT_ACTION_EVENT_NAME_REQUEST_STATE = getRootActionEventName(NAME_COLLAPSE, 'request-state')

const ROOT_EVENT_NAME_ACCORDION = getRootEventName(NAME_COLLAPSE, 'accordion')
const ROOT_EVENT_NAME_STATE = getRootEventName(NAME_COLLAPSE, 'state')
const ROOT_EVENT_NAME_SYNC_STATE = getRootEventName(NAME_COLLAPSE, 'sync-state')

const {
    mixin: modelMixin,
    props: modelProps,
    prop: MODEL_PROP_NAME,
    event: MODEL_EVENT_NAME
} = makeModelMixin('visible', { type: PROP_TYPE_BOOLEAN, defaultValue: false })

// --- Props ---

export const props = makePropsConfigurable(
    sortKeys({
        ...idProps,
        ...modelProps,
        // If `true` (and `visible` is `true` on mount), animate initially visible
        accordion: makeProp(PROP_TYPE_STRING),
        appear: makeProp(PROP_TYPE_BOOLEAN, false),
        isNav: makeProp(PROP_TYPE_BOOLEAN, false),
        tag: makeProp(PROP_TYPE_STRING, 'div')
    }),
    NAME_COLLAPSE
)

// --- Main component ---

// @vue/component
export const BCollapse = /*#__PURE__*/ defineComponent({
    name: NAME_COLLAPSE,
    mixins: [idMixin, modelMixin, normalizeSlotMixin, listenOnRootMixin],
    props,
    emits: [EVENT_NAME_HIDE, EVENT_NAME_HIDDEN, EVENT_NAME_SHOW, EVENT_NAME_SHOWN, MODEL_EVENT_NAME],
    data() {
        return {
            show: this[MODEL_PROP_NAME],
            transitioning: false
        }
    },
    computed: {
        classObject() {
            const { transitioning } = this
            return {
                'navbar-collapse': this.isNav,
                collapse: !transitioning,
                show: this.show && !transitioning
            }
        },
        slotScope() {
            return {
                visible: this.show,
                close: () => {
                    this.show = false
                }
            }
        }
    },
    watch: {
        [MODEL_PROP_NAME](newValue) {
            if (newValue !== this.show) {
                this.show = newValue
            }
        },
        show(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.emitState()
            }
        }
    },
    created() {
        this.show = this[MODEL_PROP_NAME]
    },
    mounted() {
        this.show = this[MODEL_PROP_NAME]

        // Listen for toggle events to open/close us
        this.listenOnRoot(ROOT_ACTION_EVENT_NAME_TOGGLE, ({ id }) => this.handleToggleEvent(id))
            // Listen to other collapses for accordion events
        this.listenOnRoot(ROOT_EVENT_NAME_ACCORDION, ({ id, accordion }) => this.handleAccordionEvent(id, accordion))
        if (this.isNav) {
            // Set up handlers
            this.setWindowEvents(true)
            this.handleResize()
        }
        this.$nextTick(() => {
            // turning off component $emit from onmounted as that creates an odd racecondition when using v-model.
            this.emitState(false)
        })

        // Listen for "Sync state" requests from `v-b-toggle`
        this.listenOnRoot(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, ({ id }) => {
            if (id === this.safeId()) {
                this.$nextTick(this.emitSync)
            }
        })
    },
    updated() {
        // Emit a private event every time this component updates to ensure
        // the toggle button is in sync with the collapse's state
        // It is emitted regardless if the visible state changes
        this.emitSync()
    },
    /* istanbul ignore next */
    deactivated() {
        if (this.isNav) {
            this.setWindowEvents(false)
        }
    },
    /* istanbul ignore next */
    activated() {
        if (this.isNav) {
            this.setWindowEvents(true)
        }
        this.emitSync()
    },
    beforeUnmount() {
        // Trigger state emit if needed
        this.show = false
        if (this.isNav && IS_BROWSER) {
            this.setWindowEvents(false)
        }
    },
    methods: {
        setWindowEvents(on) {
            eventOnOff(on, window, 'resize', this.handleResize, EVENT_OPTIONS_NO_CAPTURE)
            eventOnOff(on, window, 'orientationchange', this.handleResize, EVENT_OPTIONS_NO_CAPTURE)
        },
        toggle() {
            this.show = !this.show
        },
        onEnter() {
            this.transitioning = true
                // This should be moved out so we can add cancellable events
            this.$emit(EVENT_NAME_SHOW)
        },
        onAfterEnter() {
            this.transitioning = false
            this.$emit(EVENT_NAME_SHOWN)
        },
        onLeave() {
            this.transitioning = true
                // This should be moved out so we can add cancellable events
            this.$emit(EVENT_NAME_HIDE)
        },
        onAfterLeave() {
            this.transitioning = false
            this.$emit(EVENT_NAME_HIDDEN)
        },
        emitState(localEmit = true) {
            const { show, accordion } = this
            const id = this.safeId()

            if (localEmit) {
                this.$emit(MODEL_EVENT_NAME, show)
            }

            // Let `v-b-toggle` know the state of this collapse
            this.emitOnRoot(ROOT_EVENT_NAME_STATE, { id, show })
            if (accordion && show) {
                // Tell the other collapses in this accordion to close
                this.emitOnRoot(ROOT_EVENT_NAME_ACCORDION, { id, accordion })
            }
        },
        emitSync() {
            // Emit a private event every time this component updates to ensure
            // the toggle button is in sync with the collapse's state
            // It is emitted regardless if the visible state changes
            this.emitOnRoot(ROOT_EVENT_NAME_SYNC_STATE, { id: this.safeId(), show: this.show })
        },
        checkDisplayBlock() {
            // Check to see if the collapse has `display: block !important` set
            // We can't set `display: none` directly on `this.$el`, as it would
            // trigger a new transition to start (or cancel a current one)
            const $collapseEl = getById(this.safeId())
            if (!$collapseEl) return false

            const restore = hasClass($collapseEl, CLASS_NAME_SHOW)
            removeClass($collapseEl, CLASS_NAME_SHOW)
            const isBlock = getCS($collapseEl).display === 'block'
            if (restore) {
                addClass($collapseEl, CLASS_NAME_SHOW)
            }
            return isBlock
        },
        clickHandler(event) {
            const { target: el } = event

            const $collapseEl = getById(this.safeId())
            if (!$collapseEl) return

            // If we are in a nav/navbar, close the collapse when non-disabled link clicked
            /* istanbul ignore next: can't test `getComputedStyle()` in JSDOM */
            if (!this.isNav || !el || getCS($collapseEl).display !== 'block') {
                return
            }
            // Only close the collapse if it is not forced to be `display: block !important`
            if (
                (matches(el, '.nav-link,.dropdown-item') || closest('.nav-link,.dropdown-item', el)) &&
                !this.checkDisplayBlock()
            ) {
                this.show = false
            }
        },
        handleToggleEvent(id) {
            if (id === this.safeId()) {
                this.toggle()
            }
        },
        handleAccordionEvent(openedId, openAccordion) {

            const { accordion, show } = this
            if (!accordion || accordion !== openAccordion) {
                return
            }
            const isThis = openedId === this.safeId()
                // Open this collapse if not shown or
                // close this collapse if shown
            if ((isThis && !show) || (!isThis && show)) {
                this.toggle()
            }
        },
        handleResize() {
            const $collapseEl = getById(this.safeId())
            if (!$collapseEl) return

            // Handler for orientation/resize to set collapsed state in nav/navbar
            this.show = getCS($collapseEl).display === 'block'
        }
    },
    render() {
        const { $attrs, appear, classObject, safeId, clickHandler, tag, show, normalizeSlot, slotScope } = this

        const buildContent = () => {
            return withDirectives(h(
                tag, {
                    class: [$attrs.class, classObject],
                    id: safeId(),
                    onClick: clickHandler
                }, { default: () => normalizeSlot(SLOT_NAME_DEFAULT, slotScope) }
            ), [
                [vShow, show]
            ])

        }

        return h('div', {}, {
            default: () => [h(
                BVCollapse, {
                    appear,
                    onEnter: this.onEnter,
                    onAfterEnter: this.onAfterEnter,
                    onLeave: this.onLeave,
                    onAfterLeave: this.onAfterLeave
                }, {
                    default: () => [buildContent()]
                }
            )]
        })
    }
})
