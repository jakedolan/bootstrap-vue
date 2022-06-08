/**
 * Private ModalManager helper
 * Handles controlling modal stacking zIndexes and body adjustments/classes
 */
 import { computed, isReactive, nextTick, reactive, isRef, ref, watch } from 'vue';
import { IS_BROWSER } from '../constants/env'
import {
    addClass,
    getAttr,
    getBCR,
    getCS,
    getStyle,
    hasAttr,
    removeAttr,
    removeClass,
    requestAF,
    selectAll,
    setAttr,
    setStyle
} from '../utils/dom'
import { isNull } from '../utils/inspect'
import { toFloat, toInteger } from '../utils/number'

// --- Constants ---

// Default modal backdrop z-index
const DEFAULT_ZINDEX = 1040

// Selectors for padding/margin adjustments
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'
const SELECTOR_NAVBAR_TOGGLER = '.navbar-toggler'

// --- Main component ---

// @vue/component
export function useModalManager(){
    
    const modals = ref([])
    const baseZIndex = ref(null)
    const scrollbarWidth = ref(null)
    const isBodyOverflowing = ref(false)

    const modalCount = computed(() => modals.value.length)
    const modalsAreOpen = computed(() => modalCount > 0)

    watch(modalCount, (newCount, oldCount) => {
        if (IS_BROWSER) {
            getScrollbarWidth()
            if (newCount > 0 && oldCount === 0) {
                // Transitioning to modal(s) open
                checkScrollbar()
                setScrollbar()
                addClass(document.body, 'modal-open')
            } else if (newCount === 0 && oldCount > 0) {
                // Transitioning to modal(s) closed
                resetScrollbar()
                removeClass(document.body, 'modal-open')
            }
            setAttr(document.body, 'data-modal-open-count', String(newCount))
        }
    })

    watch(modals, (newValue) => {
        checkScrollbar()
        requestAF(() => {
            updateModals(newValue || [])
        })
    })
    
    // Public methods
    function registerModal(modal) {
        // Register the modal if not already registered
        if (modal && modals.value.indexOf(modal) === -1) {
            modals.value.push(modal)
        }
    }

    function unregisterModal(modal) {
        const index = modals.value.indexOf(modal)
        if (index > -1) {
            // Remove modal from modals array
            modals.value.splice(index, 1)
                // Reset the modal's data
            if (!modal._isBeingDestroyed && !modal._isDestroyed) {
                resetModal(modal)
            }
        }
    }
    
    function getBaseZIndex() {
        if (IS_BROWSER && isNull(baseZIndex.value)) {
            // Create a temporary `div.modal-backdrop` to get computed z-index
            const div = document.createElement('div')
            addClass(div, 'modal-backdrop')
            addClass(div, 'd-none')
            setStyle(div, 'display', 'none')
            document.body.appendChild(div)
            baseZIndex.value = toInteger(getCS(div).zIndex, DEFAULT_ZINDEX)
            document.body.removeChild(div)
        }
        return baseZIndex.value || DEFAULT_ZINDEX
    }

    function getScrollbarWidth() {
        if (IS_BROWSER && isNull(scrollbarWidth.value)) {
            // Create a temporary `div.measure-scrollbar` to get computed z-index
            const div = document.createElement('div')
            addClass(div, 'modal-scrollbar-measure')
            document.body.appendChild(div)
            scrollbarWidth.value = getBCR(div).width - div.clientWidth
            document.body.removeChild(div)
        }
        return scrollbarWidth.value || 0
    }

    // Private methods
    function updateModals(modals) {
        const localBaseZIndex = getBaseZIndex()
        const localScrollbarWidth = getScrollbarWidth()
        modals.forEach((modal, index) => {
            // We update data values on each modal
            modal.zIndex = localBaseZIndex + index
            modal.scrollbarWidth = localScrollbarWidth
            modal.isTop = index === modals.value.length - 1
            modal.isBodyOverflowing = isBodyOverflowing.value
        })
    }
    function resetModal(modal) {
        if (modal) {
            modal.zIndex = getBaseZIndex()
            modal.isTop = true
            modal.isBodyOverflowing = false
        }
    }

    function checkScrollbar() {
        // Determine if the body element is overflowing
        const { left, right } = getBCR(document.body)
        isBodyOverflowing.value = left + right < window.innerWidth
    }

    function setScrollbar() {
        const body = document.body
            // Storage place to cache changes to margins and padding
            // Note: This assumes the following element types are not added to the
            // document after the modal has opened.
        body._paddingChangedForModal = body._paddingChangedForModal || []
        body._marginChangedForModal = body._marginChangedForModal || []
        if (isBodyOverflowing.value) {
            const localScrollbarWidth = scrollbarWidth.value
                // Adjust fixed content padding
                /* istanbul ignore next: difficult to test in JSDOM */
            selectAll(SELECTOR_FIXED_CONTENT).forEach(el => {
                    const actualPadding = getStyle(el, 'paddingRight') || ''
                    setAttr(el, 'data-padding-right', actualPadding)
                    setStyle(el, 'paddingRight', `${toFloat(getCS(el).paddingRight, 0) + localScrollbarWidth}px`)
                    body._paddingChangedForModal.push(el)
                })
                // Adjust sticky content margin
                /* istanbul ignore next: difficult to test in JSDOM */
            selectAll(SELECTOR_STICKY_CONTENT).forEach(el => /* istanbul ignore next */ {
                    const actualMargin = getStyle(el, 'marginRight') || ''
                    setAttr(el, 'data-margin-right', actualMargin)
                    setStyle(el, 'marginRight', `${toFloat(getCS(el).marginRight, 0) - localScrollbarWidth}px`)
                    body._marginChangedForModal.push(el)
                })
                // Adjust <b-navbar-toggler> margin
                /* istanbul ignore next: difficult to test in JSDOM */
            selectAll(SELECTOR_NAVBAR_TOGGLER).forEach(el => /* istanbul ignore next */ {
                    const actualMargin = getStyle(el, 'marginRight') || ''
                    setAttr(el, 'data-margin-right', actualMargin)
                    setStyle(el, 'marginRight', `${toFloat(getCS(el).marginRight, 0) + localScrollbarWidth}px`)
                    body._marginChangedForModal.push(el)
                })
                // Adjust body padding
            const actualPadding = getStyle(body, 'paddingRight') || ''
            setAttr(body, 'data-padding-right', actualPadding)
            setStyle(body, 'paddingRight', `${toFloat(getCS(body).paddingRight, 0) + localScrollbarWidth}px`)
        }
    }

    function resetScrollbar() {
        const body = document.body
        if (body._paddingChangedForModal) {
            // Restore fixed content padding
            body._paddingChangedForModal.forEach(el => {
                /* istanbul ignore next: difficult to test in JSDOM */
                if (hasAttr(el, 'data-padding-right')) {
                    setStyle(el, 'paddingRight', getAttr(el, 'data-padding-right') || '')
                    removeAttr(el, 'data-padding-right')
                }
            })
        }
        if (body._marginChangedForModal) {
            // Restore sticky content and navbar-toggler margin
            body._marginChangedForModal.forEach(el => {
                /* istanbul ignore next: difficult to test in JSDOM */
                if (hasAttr(el, 'data-margin-right')) {
                    setStyle(el, 'marginRight', getAttr(el, 'data-margin-right') || '')
                    removeAttr(el, 'data-margin-right')
                }
            })
        }
        body._paddingChangedForModal = null
        body._marginChangedForModal = null
            // Restore body padding
        if (hasAttr(body, 'data-padding-right')) {
            setStyle(body, 'paddingRight', getAttr(body, 'data-padding-right') || '')
            removeAttr(body, 'data-padding-right')
        }
    }

    return {
      getBaseZIndex,
      getScrollbarWidth,
      modalsAreOpen,
      registerModal,
      unregisterModal
    }
}
