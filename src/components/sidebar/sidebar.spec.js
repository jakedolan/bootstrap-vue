import { mount } from '@vue/test-utils'
import { waitNT, waitRAF } from '../../../tests/utils'
import { BSidebar } from './sidebar'
import { emitter } from '../../utils/emitter.js'

const ROOT_ACTION_EVENT_NAME_REQUEST_STATE = 'bv::request-state::collapse'
const ROOT_ACTION_EVENT_NAME_TOGGLE = 'bv::toggle::collapse'

const ROOT_EVENT_NAME_STATE = 'bv::collapse::state'
const ROOT_EVENT_NAME_SYNC_STATE = 'bv::collapse::sync-state'

describe('sidebar', () => {
    it('should have expected default structure', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-1',
                visible: true
            }
        })

        expect(wrapper.vm).toBeDefined()

        const $sidebar = wrapper.find('.b-sidebar')
        expect($sidebar.exists()).toBe(true)

        const $backdrop = wrapper.find('.b-sidebar-backdrop')
        expect($backdrop.exists()).toBe(false)

        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.attributes('id')).toBeDefined()
        expect($sidebar.attributes('id')).toEqual('test-1')
        expect($sidebar.classes()).toContain('b-sidebar')
        expect($sidebar.classes()).not.toContain('b-sidebar-right')
            // `show` and `slide` class only added during transition
        expect($sidebar.classes()).not.toContain('show')
        expect($sidebar.classes()).not.toContain('slide')
        expect($sidebar.text()).toEqual('')
            // Check for no presence of `display: none' from `v-show` directive
        expect($sidebar.element).toBeVisible()

        expect($sidebar.find('.b-sidebar-header').exists()).toBe(true)
        expect($sidebar.find('.b-sidebar-body').exists()).toBe(true)
        expect($sidebar.find('.b-sidebar-footer').exists()).toBe(false)

        await wrapper.setProps({ visible: false })
        await waitRAF()
        await waitRAF()
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')
            // Check for no presence of `display: none' from `v-show` directive
        expect($sidebar.element).not.toBeVisible()

        await wrapper.setProps({ visible: true })
        await waitRAF()
        await waitRAF()
        expect(wrapper.element.tagName).toBe('DIV')
            // Check for no presence of `display: none' from `v-show` directive
        expect($sidebar.element).toBeVisible()

        wrapper.unmount()
    })

    it('shows backdrop when prop `backdrop` is `true`', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-backdrop',
                noCloseOnBackdrop: true,
                visible: true,
                backdrop: true
            }
        })

        expect(wrapper.vm).toBeDefined()

        const $sidebar = wrapper.find('.b-sidebar')
        expect($sidebar.exists()).toBe(true)

        const $backdrop = wrapper.find('.b-sidebar-backdrop')
        expect($backdrop.exists()).toBe(true)
        expect($backdrop.classes()).toContain('bg-dark')

        await $backdrop.trigger('click')
        await waitRAF()
        await waitRAF()
        expect($sidebar.element).toBeVisible()
        expect($backdrop.element).toBeVisible()

        await wrapper.setProps({ noCloseOnBackdrop: false })
        await waitRAF()
        await waitRAF()
        expect($sidebar.element).toBeVisible()
        expect($backdrop.element).toBeVisible()

        await $backdrop.trigger('click')
        await waitRAF()
        await waitRAF()
        expect($sidebar.element).not.toBeVisible()
        expect($backdrop.element).not.toBeVisible()

        wrapper.unmount()
    })

    it('applies "bg-*" class to backdrop based on `backdrop-variant` prop', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-backdrop',
                noCloseOnBackdrop: true,
                visible: true,
                backdrop: true,
                backdropVariant: 'transparent'
            }
        })

        expect(wrapper.vm).toBeDefined()

        const $sidebar = wrapper.find('.b-sidebar')
        expect($sidebar.exists()).toBe(true)

        const $backdrop = wrapper.find('.b-sidebar-backdrop')
        expect($backdrop.exists()).toBe(true)
        expect($backdrop.classes()).toContain('bg-transparent')

        await $backdrop.trigger('click')
        await waitRAF()
        await waitRAF()
        expect($sidebar.element).toBeVisible()
        expect($backdrop.element).toBeVisible()

        await wrapper.setProps({ noCloseOnBackdrop: false })
        await waitRAF()
        await waitRAF()
        expect($sidebar.element).toBeVisible()
        expect($backdrop.element).toBeVisible()

        await $backdrop.trigger('click')
        await waitRAF()
        await waitRAF()
        expect($sidebar.element).not.toBeVisible()
        expect($backdrop.element).not.toBeVisible()

        wrapper.unmount()
    })

    it('shows and hides in response to v-b-toggle events', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-toggle'
            }
        })

        expect(wrapper.vm).toBeDefined()

        const $sidebar = wrapper.find('.b-sidebar')
        expect($sidebar.exists()).toBe(true)
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).not.toBeVisible()

        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'test-toggle' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitRAF()
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).toBeVisible()

        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'test-toggle' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitRAF()
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).not.toBeVisible()

        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'foobar' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitRAF()
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).not.toBeVisible()

        wrapper.unmount()
    })

    it('closes when ESC key is pressed', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-esc'
            }
        })

        expect(wrapper.vm).toBeDefined()

        const $sidebar = wrapper.find('.b-sidebar')
        expect($sidebar.exists()).toBe(true)
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).not.toBeVisible()

        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'test-esc' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitRAF()
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).toBeVisible()

        await wrapper.trigger('keydown.esc')
        await waitRAF()
        await waitRAF()
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).not.toBeVisible()

        await wrapper.setProps({ noCloseOnEsc: true })
        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'test-esc' })
        await waitRAF()
        await waitRAF()
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).toBeVisible()

        await wrapper.trigger('keydown.esc')
        await waitRAF()
        await waitRAF()
        expect($sidebar.element.tagName).toBe('DIV')
        expect($sidebar.element).toBeVisible()

        wrapper.unmount()
    })

    it('handles state sync requests', async() => {
        const spyRootEventNameState = jest.fn()
        const spyRootEventNameSyncState = jest.fn()

        emitter.$on(ROOT_EVENT_NAME_STATE, spyRootEventNameState)
        emitter.$on(ROOT_EVENT_NAME_SYNC_STATE, spyRootEventNameSyncState)

        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-sync',
                visible: true
            }
        })

        expect(wrapper.vm).toBeDefined()

        await waitNT(wrapper.vm)
        await waitRAF()
        await waitRAF()

        expect(spyRootEventNameState).toHaveBeenCalled()
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameState.mock.calls[0][0].id).toBe('test-sync') // ID
        expect(spyRootEventNameState.mock.calls[0][0].state).toBe(true) // Visible state
        expect(spyRootEventNameSyncState).not.toHaveBeenCalled()

        emitter.$emit(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, { id: 'test-sync' })

        await waitNT(wrapper.vm)
        await waitRAF()
        await waitRAF()

        expect(spyRootEventNameSyncState).toHaveBeenCalled()
        expect(spyRootEventNameSyncState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameSyncState.mock.calls[0][0].id).toBe('test-sync') // ID
        expect(spyRootEventNameSyncState.mock.calls[0][0].state).toBe(true) // Visible state

        wrapper.unmount()
    })

    it('should have expected structure when `no-header` is set', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-2',
                visible: true,
                noHeader: true
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.find('.b-sidebar-header').exists()).toBe(false)
        expect(wrapper.find('.b-sidebar-body').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-footer').exists()).toBe(false)

        wrapper.unmount()
    })

    it('should have expected structure when `no-header-close` is set', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-3',
                visible: true,
                noHeaderClose: true
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.find('.b-sidebar-header').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-header .close').exists()).toBe(false)
        expect(wrapper.find('.b-sidebar-body').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-footer').exists()).toBe(false)

        wrapper.unmount()
    })

    it('should have expected structure when `lazy` is set', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-4',
                visible: false,
                lazy: true
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.find('.b-sidebar-header').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-body').exists()).toBe(false)
        expect(wrapper.find('.b-sidebar-footer').exists()).toBe(false)

        await wrapper.setProps({ visible: true })
        await waitRAF()
        await waitRAF()
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.find('.b-sidebar-header').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-body').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-footer').exists()).toBe(false)

        wrapper.unmount()
    })

    it('should have expected structure when `header` slot provided', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'sidebar-header-slot',
                visible: true,
                title: 'TITLE',
                headerTag: 'div'
            },
            slots: {
                header: 'Custom header'
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')

        const $header = wrapper.find('.b-sidebar-header')
        expect($header.exists()).toBe(true)
        expect($header.element.tagName).toBe('DIV')
        expect($header.find('strong').exists()).toBe(false)
        expect($header.find('button').exists()).toBe(false)
        expect($header.text()).toContain('Custom header')
        expect($header.text()).not.toContain('TITLE')

        expect(wrapper.find('.b-sidebar-footer').exists()).toBe(false)

        wrapper.unmount()
    })

    it('should have expected structure when `footer` slot provided', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-5',
                visible: true,
                footerTag: 'div'
            },
            slots: {
                footer: '<span>FOOTER</span>'
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')

        expect(wrapper.find('.b-sidebar-header').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-body').exists()).toBe(true)

        const $footer = wrapper.find('.b-sidebar-footer')
        expect($footer.exists()).toBe(true)
        expect($footer.element.tagName).toBe('DIV')
        expect($footer.text()).toEqual('FOOTER')

        wrapper.unmount()
    })

    it('should have expected structure when `title` prop provided', async() => {
        const wrapper = mount(BSidebar, {
            attachTo: document.body,
            props: {
                id: 'test-title',
                visible: true,
                title: 'TITLE'
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.find('.b-sidebar-header').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-header > strong').text()).toEqual('TITLE')
        expect(wrapper.find('.b-sidebar-body').exists()).toBe(true)
        expect(wrapper.find('.b-sidebar-footer').exists()).toBe(false)

        wrapper.unmount()
    })
})