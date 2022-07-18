import { defineComponent, h, Transition, withDirectives, vShow } from 'vue'
import { COMPONENT_UID_KEY, NAME_COLLAPSE, NAME_SIDEBAR } from '../../constants/components'
import { IS_BROWSER } from '../../constants/env'
import { EVENT_NAME_CHANGE, EVENT_NAME_HIDDEN, EVENT_NAME_SHOWN } from '../../constants/events'
import { CODE_ESC } from '../../constants/key-codes'
import {
    PROP_TYPE_ARRAY_OBJECT_STRING,
    PROP_TYPE_BOOLEAN,
    PROP_TYPE_BOOLEAN_STRING,
    PROP_TYPE_NUMBER_STRING,
    PROP_TYPE_OBJECT,
    PROP_TYPE_STRING
} from '../../constants/props'
import {
    SLOT_NAME_DEFAULT,
    SLOT_NAME_FOOTER,
    SLOT_NAME_HEADER,
    SLOT_NAME_HEADER_CLOSE,
    SLOT_NAME_TITLE
} from '../../constants/slots'
import { cloneDeep } from '../../utils/clone-deep'
import { attemptFocus, contains, getActiveElement, getTabables } from '../../utils/dom'
import { getRootActionEventName, getRootEventName } from '../../utils/events'
import { makeModelMixin } from '../../utils/model'
import { sortKeys } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { attrsMixin } from '../../mixins/attrs'
import { idMixin, props as idProps } from '../../mixins/id'
import { listenOnRootMixin } from '../../mixins/listen-on-root'
import { normalizeSlotMixin } from '../../mixins/normalize-slot'
import { BIconX } from '../../icons/icons'
import { BButtonClose } from '../button/button-close'
import { BVTransition } from '../transition/bv-transition'

// --- Constants ---

const CLASS_NAME = 'b-sidebar'

const ROOT_ACTION_EVENT_NAME_REQUEST_STATE = getRootActionEventName(NAME_COLLAPSE, 'request-state')
const ROOT_ACTION_EVENT_NAME_TOGGLE = getRootActionEventName(NAME_COLLAPSE, 'toggle')

const ROOT_EVENT_NAME_STATE = getRootEventName(NAME_COLLAPSE, 'state')
const ROOT_EVENT_NAME_SYNC_STATE = getRootEventName(NAME_COLLAPSE, 'sync-state')

const {
    mixin: modelMixin,
    props: modelProps,
    prop: MODEL_PROP_NAME,
    event: MODEL_EVENT_NAME
} = makeModelMixin('visible', {
    type: PROP_TYPE_BOOLEAN,
    defaultValue: false,
    event: EVENT_NAME_CHANGE
})

// --- Props ---

export const props = makePropsConfigurable(
    sortKeys({
        ...idProps,
        ...modelProps,
        ariaLabel: makeProp(PROP_TYPE_STRING),
        ariaLabelledby: makeProp(PROP_TYPE_STRING),
        // If `true`, shows a basic backdrop
        backdrop: makeProp(PROP_TYPE_BOOLEAN, false),
        backdropVariant: makeProp(PROP_TYPE_STRING, 'dark'),
        bgVariant: makeProp(PROP_TYPE_STRING, 'light'),
        bodyClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        // `aria-label` for close button
        closeLabel: makeProp(PROP_TYPE_STRING, null),
        emitter: makeProp(PROP_TYPE_OBJECT, null),
        footerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        footerTag: makeProp(PROP_TYPE_STRING, 'footer'),
        headerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        headerTag: makeProp(PROP_TYPE_STRING, 'header'),
        lazy: makeProp(PROP_TYPE_BOOLEAN, false),
        noCloseOnBackdrop: makeProp(PROP_TYPE_BOOLEAN, false),
        noCloseOnEsc: makeProp(PROP_TYPE_BOOLEAN, false),
        noCloseOnRouteChange: makeProp(PROP_TYPE_BOOLEAN, false),
        noEnforceFocus: makeProp(PROP_TYPE_BOOLEAN, false),
        noHeader: makeProp(PROP_TYPE_BOOLEAN, false),
        noHeaderClose: makeProp(PROP_TYPE_BOOLEAN, false),
        noSlide: makeProp(PROP_TYPE_BOOLEAN, false),
        right: makeProp(PROP_TYPE_BOOLEAN, false),
        shadow: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
        sidebarClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
        tag: makeProp(PROP_TYPE_STRING, 'div'),
        textVariant: makeProp(PROP_TYPE_STRING, 'dark'),
        title: makeProp(PROP_TYPE_STRING),
        width: makeProp(PROP_TYPE_STRING),
        zIndex: makeProp(PROP_TYPE_NUMBER_STRING)
    }),
    NAME_SIDEBAR
)

// --- Render methods ---

const renderHeaderTitle = (ctx) => {
    // Render a empty `<span>` when to title was provided
    const title = ctx.normalizeSlot(SLOT_NAME_TITLE, ctx.slotScope) || ctx.title
    if (!title) {
        return h('span')
    }

    return h('strong', { id: ctx.safeId('__title__') }, { 
      default: () => [title] })
}

const renderHeaderClose = (ctx) => {
    if (ctx.noHeaderClose) {
        return null
    }

    const { closeLabel, textVariant, hide } = ctx

    return h(
        BButtonClose, {
            ariaLabel: closeLabel, 
            textVariant,
            onClick: hide,
            ref: 'close-button'
        }, { 
          default: () => [ctx.normalizeSlot(SLOT_NAME_HEADER_CLOSE) || h(BIconX)]
        }
    )
}

const renderHeader = (ctx) => {
    if (ctx.noHeader) {
        return null
    }

    let $content = ctx.normalizeSlot(SLOT_NAME_HEADER, ctx.slotScope)
    if (!$content) {
        const $title = renderHeaderTitle(ctx)
        const $close = renderHeaderClose(ctx)
        $content = ctx.right ? [$close, $title] : [$title, $close]
    }

    return h(
        ctx.headerTag, {
            class: [ `${CLASS_NAME}-header`, ctx.headerClass ],
            key: 'header'
        },
        $content
    )
}

const renderBody = (ctx) => {
    return h(
        'div', {
            class: [`${CLASS_NAME}-body`, ctx.bodyClass],
            key: 'body'
        }, { 
          default: () => [ctx.normalizeSlot(SLOT_NAME_DEFAULT, ctx.slotScope)] 
        }
    )
}

const renderFooter = (ctx) => {
    const $footer = ctx.normalizeSlot(SLOT_NAME_FOOTER, ctx.slotScope)
    if (!$footer) {
        return null
    }

    return h(
        ctx.footerTag, {
            class: [`${CLASS_NAME}-footer`, ctx.footerClass],
            key: 'footer'
        }, { 
          default: () => [$footer] 
        }
    )
}

const renderContent = (ctx) => {
    // We render the header even if `lazy` is enabled as it
    // acts as the accessible label for the sidebar
    const $header = renderHeader(ctx)
    if (ctx.lazy && !ctx.isOpen) {
        return $header
    }

    return [$header, renderBody(ctx), renderFooter(ctx)]
}

const renderBackdrop = (ctx) => {
    if (!ctx.backdrop) {
        return null
    }

    const { backdropVariant } = ctx

    return withDirectives(h('div', {
        class: [ 'b-sidebar-backdrop', {
            [`bg-${backdropVariant}`]: backdropVariant
        }],
        onClick: ctx.onBackdropClick 
    }), [[vShow, ctx.localShow ]])
}

// --- Main component ---

// @vue/component
export const BSidebar = /*#__PURE__*/ defineComponent({
    name: NAME_SIDEBAR,
    mixins: [attrsMixin, idMixin, modelMixin, listenOnRootMixin, normalizeSlotMixin],
    inheritAttrs: false,
    props,
    emits: [EVENT_NAME_HIDDEN, EVENT_NAME_SHOWN, MODEL_EVENT_NAME],
    data() {
        const visible = !!this[MODEL_PROP_NAME]
        return {
            // Internal `v-model` state
            localShow: visible,
            // For lazy render triggering
            isOpen: visible
        }
    },
    computed: {
        transitionProps() {
            return this.noSlide ?
                /* istanbul ignore next */
                { css: true } : {
                    css: true,
                    enterFromClass: '',
                    enterActiveClass: 'slide',
                    enterToClass: 'show',
                    leaveFromClass: 'show',
                    leaveActiveClass: 'slide',
                    leaveToClass: ''
                }
        },
        slotScope() {
            const { hide, right, localShow: visible } = this
            return { hide, right, visible }
        },
        hasTitle() {
            const { $slots } = this
            return (!this.noHeader &&
                !this.hasNormalizedSlot(SLOT_NAME_HEADER) &&
                !!(this.normalizeSlot(SLOT_NAME_TITLE, this.slotScope, $slots) || this.title)
            )
        },
        titleId() {
            return this.hasTitle ? this.safeId('__title__') : null
        },
        computedAttrs() {
            return {
                ...this.bvAttrs,
                id: this.safeId(),
                tabindex: '-1',
                role: 'dialog',
                'aria-modal': this.backdrop ? 'true' : 'false',
                'aria-hidden': this.localShow ? null : 'true',
                'aria-label': this.ariaLabel || null,
                'aria-labelledby': this.ariaLabelledby || this.titleId || null
            }
        }
    },
    watch: {
        [MODEL_PROP_NAME](newValue, oldValue) {
            if (newValue !== oldValue) {
                this.localShow = newValue
            }
        },
        localShow(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.emitState(newValue)
                this.$emit(MODEL_EVENT_NAME, newValue)
            }
        },
        /* istanbul ignore next */
        $route(newValue = {}, oldValue = {}) {
            if (!this.noCloseOnRouteChange && newValue.fullPath !== oldValue.fullPath) {
                this.hide()
            }
        }
    },
    created() {
        // Define non-reactive properties
        this.$_returnFocusEl = null
    },
    mounted() {
        // Add `$root` listeners
        this.listenOnRoot(ROOT_ACTION_EVENT_NAME_TOGGLE, ({ id }) => this.handleToggle(id))
        this.listenOnRoot(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, ({ id }) => this.handleSync(id))
            // Send out a gratuitous state event to ensure toggle button is synced
        this.$nextTick(() => {
            this.emitState(this.localShow)
        })
    },
    /* istanbul ignore next */
    activated() {
        this.emitSync()
    },
    beforeUnmount() {
        this.localShow = false
        this.$_returnFocusEl = null
    },
    methods: {
        hide() {
            this.localShow = false
        },
        emitState(state = this.localShow) {   
            this.emitOnRoot(ROOT_EVENT_NAME_STATE, { id: this.safeId(), state })
        },
        emitSync(state = this.localShow) {          
            this.emitOnRoot(ROOT_EVENT_NAME_SYNC_STATE, { id: this.safeId(), state })
        },
        handleToggle(id) {
            // Note `safeId()` can be null until after mount
            if (id && id === this.safeId()) {
                this.localShow = !this.localShow
            }
        },
        handleSync(id) {
            // Note `safeId()` can be null until after mount
            if (id && id === this.safeId()) {
                this.$nextTick(() => {
                    this.emitSync(this.localShow)
                })
            }
        },
        onKeydown(event) {
            const { keyCode } = event
            if (!this.noCloseOnEsc && keyCode === CODE_ESC && this.localShow) {
                this.hide()
            }
        },
        onBackdropClick() {
            if (this.localShow && !this.noCloseOnBackdrop) {
                this.hide()
            }
        },
        /* istanbul ignore next */
        onTopTrapFocus() {
            const tabables = getTabables(this.$refs.content)
            this.enforceFocus(tabables.reverse()[0])
        },
        /* istanbul ignore next */
        onBottomTrapFocus() {
            const tabables = getTabables(this.$refs.content)
            this.enforceFocus(tabables[0])
        },
        onBeforeEnter() {
            // Returning focus to `document.body` may cause unwanted scrolls,
            // so we exclude setting focus on body
            this.$_returnFocusEl = getActiveElement(IS_BROWSER ? [document.body] : [])
                // Trigger lazy render
            this.isOpen = true
        },
        onAfterEnter(el) {
            if (!contains(el, getActiveElement())) {
                this.enforceFocus(el)
            }
            this.$emit(EVENT_NAME_SHOWN)
        },
        onAfterLeave() {
            this.enforceFocus(this.$_returnFocusEl)
            this.$_returnFocusEl = null
                // Trigger lazy render
            this.isOpen = false
            this.$emit(EVENT_NAME_HIDDEN)
        },
        enforceFocus(el) {
            if (!this.noEnforceFocus) {
                attemptFocus(el)
            }
        }
    },
    render() {
        const { bgVariant, width, textVariant, localShow } = this
        const shadow = this.shadow === '' ? true : this.shadow


        const $sidebar = h(Transition, {
                ...this.transitionProps,
                onBeforeEnter: this.onBeforeEnter,
                onAfterEnter: this.onAfterEnter,
                onAfterLeave: this.onAfterLeave,
            }, {
              default: () => withDirectives(h(
                    this.tag, {
                        class: [CLASS_NAME, {
                                shadow: shadow === true,
                                [`shadow-${shadow}`]: shadow && shadow !== true,
                                [`${CLASS_NAME}-right`]: this.right,
                                [`bg-${bgVariant}`]: bgVariant,
                                [`text-${textVariant}`]: textVariant
                            },
                            this.sidebarClass
                        ],
                        style: { width },
                        ...this.computedAttrs,
                        ref: 'content'
                    }, { 
                      default: () => [renderContent(this)] 
                    }
                ), [[vShow, localShow]])
            }
        )

        const $backdrop = h(BVTransition, { noFade: this.noSlide }, { 
          default: () => [renderBackdrop(this)]
        })

        let $tabTrapTop = null
        let $tabTrapBottom = null
        if (this.backdrop && localShow) {
            $tabTrapTop = h('div', {
                tabindex: '0',
                onFocus: this.onTopTrapFocus
            })
            $tabTrapBottom = h('div', {
                tabindex: '0',
                onFocus: this.onBottomTrapFocus
            })
        }

        return h(
            'div', {
                class: 'b-sidebar-outer',
                style: { zIndex: this.zIndex },
                tabindex: '-1',
                onKeydown: this.onKeydown,
            }, { 
              default: () => [$tabTrapTop, $sidebar, $tabTrapBottom, $backdrop]
            }
        )
    }
})