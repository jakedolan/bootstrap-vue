import { mount } from '@vue/test-utils'
import { waitNT, waitRAF } from '../../../tests/utils'
import { BNavbarToggle } from './navbar-toggle'
import { emitter } from '../../utils/emitter.js'

const ROOT_ACTION_EVENT_NAME_TOGGLE = 'bv::toggle::collapse'

const ROOT_EVENT_NAME_STATE = 'bv::collapse::state'
const ROOT_EVENT_NAME_SYNC_STATE = 'bv::collapse::sync-state'

describe('navbar-toggle', () => {
    it('default has tag "button"', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-1'
            }
        })

        expect(wrapper.element.tagName).toBe('BUTTON')

        wrapper.unmount()
    })

    it('default has class "navbar-toggler"', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-2'
            }
        })

        expect(wrapper.classes()).toContain('navbar-toggler')
            // Class added by v-b-toggle
        expect(wrapper.classes()).toContain('collapsed')
        expect(wrapper.classes().length).toBe(2)

        wrapper.unmount()
    })

    it('default has default attributes', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-3'
            }
        })

        expect(wrapper.attributes('type')).toBe('button')
        expect(wrapper.attributes('aria-controls')).toBe('target-3')
        expect(wrapper.attributes('aria-expanded')).toBe('false')
        expect(wrapper.attributes('aria-label')).toBe('Toggle navigation')

        wrapper.unmount()
    })

    it('default has inner button-close', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-4'
            }
        })

        expect(wrapper.find('span.navbar-toggler-icon')).toBeDefined()

        wrapper.unmount()
    })

    it('accepts custom label when label prop is set', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-5',
                label: 'foobar'
            }
        })

        expect(wrapper.attributes('aria-label')).toBe('foobar')

        wrapper.unmount()
    })

    it('default slot scope works', async() => {
        let scope = null
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-6'
            },
            scopedSlots: {
                default (ctx) {
                    scope = ctx
                    return this.$createElement('div', 'foobar')
                }
            }
        })

        expect(scope).not.toBe(null)
        expect(scope.expanded).toBe(false)

        emitter.$emit(ROOT_EVENT_NAME_STATE, { id: 'target-6', show: true })
        await waitNT(wrapper.vm)
        expect(scope).not.toBe(null)
        expect(scope.expanded).toBe(true)

        emitter.$emit(ROOT_EVENT_NAME_STATE, { id: 'target-6', show: false })
        await waitNT(wrapper.vm)
        expect(scope).not.toBe(null)
        expect(scope.expanded).toBe(false)

        wrapper.unmount()
    })

    it('emits click event', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-7'
            }
        })

        await waitRAF()
        await waitNT(wrapper.vm)

        let rootClicked = false
        const onRootClick = () => {
            rootClicked = true
        }
        emitter.$on(ROOT_ACTION_EVENT_NAME_TOGGLE, onRootClick)

        expect(wrapper.emitted('click')).toBeUndefined()
        expect(rootClicked).toBe(false)

        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeDefined()
        expect(rootClicked).toBe(true)

        emitter.$off(ROOT_ACTION_EVENT_NAME_TOGGLE, onRootClick)

        wrapper.unmount()
    })

    it('sets aria-expanded when receives root emit for target', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-8'
            }
        })

        // Private state event
        emitter.$emit(ROOT_EVENT_NAME_STATE, { id: 'target-8', show: true })
        await waitNT(wrapper.vm)
        expect(wrapper.attributes('aria-expanded')).toBe('true')

        emitter.$emit(ROOT_EVENT_NAME_STATE, { id: 'target-8', show: false })
        await waitNT(wrapper.vm)
        expect(wrapper.attributes('aria-expanded')).toBe('false')

        emitter.$emit(ROOT_EVENT_NAME_STATE, { id: 'foo', show: true })
        await waitNT(wrapper.vm)
        expect(wrapper.attributes('aria-expanded')).toBe('false')

        // Private sync event
        emitter.$emit(ROOT_EVENT_NAME_SYNC_STATE, { id: 'target-8', show: true })
        await waitNT(wrapper.vm)
        expect(wrapper.attributes('aria-expanded')).toBe('true')

        emitter.$emit(ROOT_EVENT_NAME_SYNC_STATE, { id: 'target-8', show: false })
        await waitNT(wrapper.vm)
        expect(wrapper.attributes('aria-expanded')).toBe('false')

        emitter.$emit(ROOT_EVENT_NAME_SYNC_STATE, { id: 'foo', show: true })
        await waitNT(wrapper.vm)
        expect(wrapper.attributes('aria-expanded')).toBe('false')

        wrapper.unmount()
    })

    it('disabled prop works', async() => {
        const wrapper = mount(BNavbarToggle, {
            props: {
                target: 'target-9',
                disabled: true
            }
        })

        expect(wrapper.emitted('click')).toBeUndefined()
        expect(wrapper.element.hasAttribute('disabled')).toBe(true)
        expect(wrapper.classes()).toContain('disabled')

        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeUndefined()

        wrapper.unmount()
    })
})