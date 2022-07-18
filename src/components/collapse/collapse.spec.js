import { h } from 'vue';
import { mount } from '@vue/test-utils'
import { waitNT, waitRAF } from '../../../tests/utils'
import { BCollapse } from './collapse'
import { emitter } from '../../utils/emitter.js'

const ROOT_ACTION_EVENT_NAME_REQUEST_STATE = 'bv::request-state::collapse'
const ROOT_ACTION_EVENT_NAME_TOGGLE = 'bv::toggle::collapse'

const ROOT_EVENT_NAME_ACCORDION = 'bv::collapse::accordion'
const ROOT_EVENT_NAME_STATE = 'bv::collapse::state'
const ROOT_EVENT_NAME_SYNC_STATE = 'bv::collapse::sync-state'

describe('collapse', () => {
    const origGetBCR = Element.prototype.getBoundingClientRect

    beforeEach(() => {
        // Mock `getBoundingClientRect()` so that the we can get a fake height for element
        // Needed for keyboard navigation testing
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        }))
    })

    afterEach(() => {
        // Reset overrides
        Element.prototype.getBoundingClientRect = origGetBCR
    })

    it('should have expected default structure', async() => {
        const wrapper = mount(BCollapse, {
                // attachTo: document.body,
                props: {
                    // 'id' is a required prop
                    id: 'test'
                }
            })
            // const rootWrapper = createWrapper(wrapper.vm.$root)
        expect(wrapper.vm).toBeDefined()
        await waitNT(wrapper.vm)
        await waitRAF()

        // wrapped by a div - this is a change due to withDirectives that I am still not understanding.
        expect(wrapper.element.tagName).toBe('DIV')


        const collapse = wrapper.find('#test');
        expect(collapse.element.tagName).toBe('DIV')
        expect(collapse.attributes('id')).toBeDefined()
        expect(collapse.attributes('id')).toEqual('test')
        expect(collapse.classes()).toContain('collapse')
        expect(collapse.classes()).not.toContain('navbar-collapse')
        expect(collapse.classes()).not.toContain('show')
        expect(collapse.element.style.display).toEqual('none')
        expect(collapse.text()).toEqual('')

        wrapper.unmount()
    })

    it('should have expected structure when prop is-nav is set', async() => {
        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test',
                isNav: true
            }
        })
        expect(wrapper.vm).toBeDefined()
        await waitNT(wrapper.vm)
        await waitRAF()
        expect(wrapper.element.tagName).toBe('DIV')

        const collapse = wrapper.find('#test');
        expect(collapse.element.tagName).toBe('DIV')
        expect(collapse.attributes('id')).toBeDefined()
        expect(collapse.attributes('id')).toEqual('test')
        expect(collapse.classes()).toContain('collapse')
        expect(collapse.classes()).toContain('navbar-collapse')
        expect(collapse.classes()).not.toContain('show')
        expect(collapse.element.style.display).toEqual('none')
        expect(collapse.text()).toEqual('')

        wrapper.unmount()
    })

    it('renders default slot content', async() => {
        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test'
            },
            slots: {
                default: '<div>foobar</div>'
            }
        })
        expect(wrapper.vm).toBeDefined()
        await waitNT(wrapper.vm)
        await waitRAF()
        expect(wrapper.element.tagName).toBe('DIV')

        const collapse = wrapper.find('#test');
        expect(collapse.element.tagName).toBe('DIV')
        expect(collapse.attributes('id')).toBeDefined()
        expect(collapse.attributes('id')).toEqual('test')
        expect(collapse.classes()).toContain('collapse')
        expect(collapse.classes()).not.toContain('show')
        expect(collapse.element.style.display).toEqual('none')
        expect(collapse.find('div > div').exists()).toBe(true)
        expect(collapse.text()).toEqual('foobar')

        wrapper.unmount()
    })

    it('should mount as visible when prop visible is true', async() => {
        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test',
                visible: true
            },
            slots: {
                default: '<div>foobar</div>'
            }
        })
        expect(wrapper.vm).toBeDefined()
        await waitNT(wrapper.vm)
        await waitRAF()
        expect(wrapper.element.tagName).toBe('DIV')

        const collapse = wrapper.find('#test');
        expect(collapse.element.tagName).toBe('DIV')
        expect(collapse.attributes('id')).toBeDefined()
        expect(collapse.attributes('id')).toEqual('test')
        expect(collapse.classes()).toContain('show')
        expect(collapse.classes()).toContain('collapse')
        expect(collapse.element.style.display).toEqual('')
        expect(collapse.find('div > div').exists()).toBe(true)
        expect(collapse.text()).toEqual('foobar')

        wrapper.unmount()
    })



    it('should emit its state on mount (initially hidden)', async() => {
        const spyRootEventNameAccordion = jest.fn()
        const spyRootEventNameState = jest.fn()

        emitter.$on(ROOT_EVENT_NAME_ACCORDION, spyRootEventNameAccordion)
        emitter.$on(ROOT_EVENT_NAME_STATE, spyRootEventNameState)

        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test'
            },
            slots: {
                default: '<div>foobar</div>'
            }
        })

        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.emitted('show')).toBeUndefined()

        // turned off this initial in component emit as it creates weird behavior when used with v-model.
        // expect(wrapper.emitted('update:visible')).toBeDefined()
        // expect(wrapper.emitted('update:visible').length).toBe(1)
        // expect(wrapper.emitted('update:visible')[0][0]).toBe(false)

        expect(spyRootEventNameAccordion).not.toHaveBeenCalled()

        expect(spyRootEventNameState).toHaveBeenCalled()
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameState.mock.calls[0][0].id).toBe('test')
        expect(spyRootEventNameState.mock.calls[0][0].show).toBe(false)

        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('none')

        wrapper.unmount()
    })


    it('should emit its state on mount (initially visible)', async() => {
        const spyRootEventNameAccordion = jest.fn()
        const spyRootEventNameState = jest.fn()

        emitter.$on(ROOT_EVENT_NAME_ACCORDION, spyRootEventNameAccordion)
        emitter.$on(ROOT_EVENT_NAME_STATE, spyRootEventNameState)

        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test',
                visible: true
            },
            slots: {
                default: '<div>foobar</div>'
            }
        })
        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.emitted('show')).toBeUndefined() // Does not emit show when initially visible

        // turned off this initial in component emit as it creates weird behavior when used with v-model.
        // expect(wrapper.emitted('update:visible')).toBeDefined()
        // expect(wrapper.emitted('update:visible').length).toBe(1)
        // expect(wrapper.emitted('update:visible')[0][0]).toBe(true)

        expect(spyRootEventNameAccordion).not.toHaveBeenCalled()

        expect(spyRootEventNameState).toHaveBeenCalled()
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameState.mock.calls[0][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[0][0].show).toBe(true) // Visible state

        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('')

        wrapper.unmount()
    })

    it('should respond to state sync requests', async() => {
        const spyRootEventNameAccordion = jest.fn()
        const spyRootEventNameState = jest.fn()
        const spyRootEventNameSyncState = jest.fn()
        const spyRootEventNameRequestState = jest.fn()

        emitter.$on(ROOT_EVENT_NAME_ACCORDION, spyRootEventNameAccordion)
        emitter.$on(ROOT_EVENT_NAME_STATE, spyRootEventNameState)
        emitter.$on(ROOT_EVENT_NAME_SYNC_STATE, spyRootEventNameSyncState)
        emitter.$on(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, spyRootEventNameRequestState)

        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test',
                visible: true
            },
            slots: {
                default: '<div>foobar</div>'
            }
        })

        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('')


        expect(wrapper.emitted('show')).toBeUndefined() // Does not emit show when initially visible

        // turned off this initial in component emit as it creates weird behavior when used with v-model.
        // expect(wrapper.emitted('update:visible')).toBeDefined()
        // expect(wrapper.emitted('update:visible').length).toBe(1)
        // expect(wrapper.emitted('update:visible')[0][0]).toBe(true)

        expect(spyRootEventNameAccordion).not.toHaveBeenCalled()

        expect(spyRootEventNameState).toHaveBeenCalled()
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameState.mock.calls[0][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[0][0].show).toBe(true) // Visible state

        expect(spyRootEventNameSyncState).not.toHaveBeenCalled();

        emitter.emit(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, { id: 'test' })
        await waitNT(wrapper.vm)
        await waitRAF()

        expect(spyRootEventNameSyncState).toHaveBeenCalled()
        expect(spyRootEventNameSyncState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameSyncState.mock.calls[0][0].id).toBe('test') // ID
        expect(spyRootEventNameSyncState.mock.calls[0][0].show).toBe(true) // Visible state

        wrapper.unmount()
    })

    it('setting visible to true after mount shows collapse', async() => {
        const spyRootEventNameState = jest.fn()

        emitter.$on(ROOT_EVENT_NAME_STATE, spyRootEventNameState)

        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test',
                visible: false
            },
            slots: {
                default: '<div>foobar</div>'
            }
        })

        await waitNT(wrapper.vm)
        await waitRAF()



        expect(wrapper.emitted('show')).toBeUndefined()

        // turned off this initial in component emit as it creates weird behavior when used with v-model.
        // expect(wrapper.emitted('update:visible')).toBeDefined()
        // expect(wrapper.emitted('update:visible').length).toBe(1)
        // expect(wrapper.emitted('update:visible')[0][0]).toBe(false)

        expect(spyRootEventNameState).toHaveBeenCalled()
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameState.mock.calls[0][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[0][0].show).toBe(false) // Visible state

        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('none')

        // Change visible prop
        await wrapper.setProps({
            visible: true
        })
        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.emitted('show')).toBeUndefined()
            // expect(wrapper.emitted('show').length).toBe(1)

        expect(wrapper.emitted('update:visible').length).toBe(1)
        expect(wrapper.emitted('update:visible')[0][0]).toBe(true)

        expect(spyRootEventNameState).toHaveBeenCalledTimes(2);
        expect(spyRootEventNameState.mock.calls[1][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[1][0].show).toBe(true) // Visible state

        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('')

        wrapper.unmount()
    })

    it('should respond to according events', async() => {
        const spyRootEventNameAccordion = jest.fn()
        const spyRootEventNameState = jest.fn()

        emitter.$on(ROOT_EVENT_NAME_ACCORDION, spyRootEventNameAccordion)
        emitter.$on(ROOT_EVENT_NAME_STATE, spyRootEventNameState)

        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test',
                accordion: 'foo',
                visible: true
            },
            slots: {
                default: '<div>foobar</div>'
            }
        })

        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('')
        expect(wrapper.emitted('show')).toBeUndefined()

        // turned off this initial in component emit as it creates weird behavior when used with v-model.
        // expect(wrapper.emitted('update:visible')).toBeDefined()
        // expect(wrapper.emitted('update:visible').length).toBe(1)
        // expect(wrapper.emitted('update:visible')[0][0]).toBe(true)

        expect(spyRootEventNameState).toHaveBeenCalled()
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameState.mock.calls[0][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[0][0].show).toBe(true) // Visible state
        expect(spyRootEventNameAccordion).toHaveBeenCalled()
        expect(spyRootEventNameAccordion).toHaveBeenCalledTimes(1);
        expect(spyRootEventNameAccordion.mock.calls[0][0].id).toBe('test')
        expect(spyRootEventNameAccordion.mock.calls[0][0].accordion).toBe('foo')

        // Does not respond to accordion events for different accordion ID
        emitter.$emit(ROOT_EVENT_NAME_ACCORDION, { id: 'test', accordion: 'bar' })
        await waitNT(wrapper.vm)
        await waitRAF()

        // expect(wrapper.emitted('update:visible').length).toBe(1)
        // expect(wrapper.emitted('update:visible')[0][0]).toBe(true)
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1)
        expect(spyRootEventNameAccordion).toHaveBeenCalledTimes(2) // The event we just emitted
        expect(spyRootEventNameAccordion.mock.calls[1][0].id).toBe('test')
        expect(spyRootEventNameAccordion.mock.calls[1][0].accordion).toBe('bar')
        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('')

        // Should respond to accordion events
        emitter.$emit(ROOT_EVENT_NAME_ACCORDION, { id: 'nottest', accordion: 'foo' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.emitted('update:visible').length).toBe(1)
        expect(wrapper.emitted('update:visible')[0][0]).toBe(false)
        expect(spyRootEventNameState).toHaveBeenCalledTimes(2)
        expect(spyRootEventNameState.mock.calls[1][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[1][0].show).toBe(false) // Visible state
        expect(spyRootEventNameAccordion).toHaveBeenCalledTimes(3) // The event we just emitted
        expect(spyRootEventNameAccordion.mock.calls[2][0].id).toBe('nottest')
        expect(spyRootEventNameAccordion.mock.calls[2][0].accordion).toBe('foo')

        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('none')

        // Toggling this closed collapse emits accordion event
        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'test' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.emitted('update:visible').length).toBe(2)
        expect(wrapper.emitted('update:visible')[1][0]).toBe(true)
        expect(spyRootEventNameState).toHaveBeenCalledTimes(3)
        expect(spyRootEventNameState.mock.calls[2][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[2][0].show).toBe(true) // Visible state
        expect(spyRootEventNameAccordion).toHaveBeenCalledTimes(4) // The event emitted by collapse
        expect(spyRootEventNameAccordion.mock.calls[3][0].id).toBe('test')
        expect(spyRootEventNameAccordion.mock.calls[3][0].accordion).toBe('foo')
        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('')

        // Toggling this open collapse to be closed
        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'test' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitNT(wrapper.vm)
        await waitRAF()
        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('none')

        // Should respond to accordion events targeting this ID when closed
        emitter.$emit(ROOT_EVENT_NAME_ACCORDION, { id: 'test', accordion: 'foo' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitNT(wrapper.vm)
        await waitRAF()
        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('')

        wrapper.unmount()
    })



    it('should close when clicking on contained nav-link prop is-nav is set', async() => {
        const App = {
            render() {
                return h('div', [
                    // JSDOM supports `getComputedStyle()` when using stylesheets (non responsive)
                    // https://github.com/jsdom/jsdom/blob/master/Changelog.md#030
                    h('style', { type: 'text/css' }, '.collapse:not(.show) { display: none; }'),
                    h(
                        BCollapse, {
                            id: 'test',
                            isNav: true,
                            visible: true
                        }, [h('a', { class: 'nav-link', href: '#' }, 'nav link')]
                    )
                ])
            }
        }
        const wrapper = mount(App, {
            attachTo: document.body
        })

        expect(wrapper.vm).toBeDefined()
        const $collapse = wrapper.findComponent(BCollapse)
        expect($collapse.vm).toBeDefined()

        expect(wrapper.find('style').exists()).toBe(true)

        await waitNT(wrapper.vm)
        await waitRAF()
        await waitNT(wrapper.vm)
        await waitRAF()

        expect($collapse.find('#test').wrapperElement.classList).toContain('show')
        expect($collapse.find('#test').wrapperElement.style.display).toEqual('')
        expect($collapse.find('.nav-link').exists()).toBe(true)

        // Click on link
        await wrapper.find('.nav-link').trigger('click')
        await waitRAF()
        await waitRAF()
        expect($collapse.find('#test').wrapperElement.classList).not.toContain('show')
        expect($collapse.find('#test').wrapperElement.style.display).toEqual('none')

        wrapper.unmount()
    })


    it('should not close when clicking on nav-link prop is-nav is set & collapse is display block important', async() => {
        const App = {
            render() {
                return h('div', [
                    h(
                        'style', { type: 'text/css' },
                        '.collapse:not(.show) { display: none; } .d-block { display: block !important; }'
                    ),
                    h(
                        BCollapse, {
                            class: 'd-block',
                            id: 'test',
                            isNav: true,
                            visible: true
                        }, [h('a', { class: 'nav-link', href: '#' }, 'nav link')]
                    )
                ])
            }
        }
        const wrapper = mount(App, {
            attachTo: document.body
        })

        expect(wrapper.vm).toBeDefined()
        const $collapse = wrapper.findComponent(BCollapse)
        expect($collapse.vm).toBeDefined()

        expect(wrapper.find('style').exists()).toBe(true)

        await waitNT(wrapper.vm)
        await waitRAF()
        await waitNT(wrapper.vm)
        await waitRAF()

        expect($collapse.find('#test').wrapperElement.classList).toContain('show')
        expect($collapse.find('#test').wrapperElement.style.display).toEqual('')
        expect($collapse.find('.nav-link').exists()).toBe(true)

        // Click on link
        await wrapper.find('.nav-link').trigger('click')
        await waitRAF()
        await waitRAF()
        expect($collapse.find('#test').wrapperElement.classList).toContain('show')
        expect($collapse.find('#test').wrapperElement.style.display).toEqual('')

        wrapper.unmount()
    })


    it('should not respond to root toggle event that does not match ID', async() => {
        const wrapper = mount(BCollapse, {
                attachTo: document.body,
                props: {
                    // 'id' is a required prop
                    id: 'test'
                },
                slots: {
                    default: '<div>foobar</div>'
                }
            })
            // const rootWrapper = createWrapper(wrapper.vm.$root)
        expect(wrapper.vm).toBeDefined()
        await waitNT(wrapper.vm)
        await waitRAF()
        expect(wrapper.find('#test').wrapperElement.classList).not.toContain('show')
        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('none')

        // Emit root event with different ID
        emitter.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, { id: 'not-test' })
        await waitNT(wrapper.vm)
        await waitRAF()
        await waitNT(wrapper.vm)
        await waitRAF()
        expect(wrapper.find('#test').wrapperElement.classList).not.toContain('show')
        expect(wrapper.find('#test').wrapperElement.style.display).toEqual('none')

        wrapper.unmount()
    })

    it('default slot scope works', async() => {
        const spyRootEventNameAccordion = jest.fn()
        const spyRootEventNameState = jest.fn()
        const spyRootEventNameSyncState = jest.fn()

        emitter.$on(ROOT_EVENT_NAME_ACCORDION, spyRootEventNameAccordion)
        emitter.$on(ROOT_EVENT_NAME_STATE, spyRootEventNameState)
        emitter.$on(ROOT_EVENT_NAME_SYNC_STATE, spyRootEventNameSyncState)

        let scope = null
        const wrapper = mount(BCollapse, {
            attachTo: document.body,
            props: {
                // 'id' is a required prop
                id: 'test',
                visible: true
            },
            slots: {
                default (props) {
                    scope = props
                    return h('div', 'foobar')
                }
            }
        })
        await waitNT(wrapper.vm)
        await waitRAF()

        expect(wrapper.find("#test").wrapperElement.style.display).toEqual('')
        expect(wrapper.emitted('show')).toBeUndefined() // Does not emit show when initially visible

        // turned off this initial in component emit as it creates weird behavior when used with v-model.
        // expect(wrapper.emitted('update:visible')).toBeDefined()
        // expect(wrapper.emitted('update:visible').length).toBe(1)
        // expect(wrapper.emitted('update:visible')[0][0]).toBe(true)

        expect(spyRootEventNameAccordion).not.toHaveBeenCalled()

        expect(spyRootEventNameState).toHaveBeenCalled()
        expect(spyRootEventNameState).toHaveBeenCalledTimes(1)
        expect(spyRootEventNameState.mock.calls[0][0].id).toBe('test') // ID
        expect(spyRootEventNameState.mock.calls[0][0].show).toBe(true) // Visible state
        expect(spyRootEventNameSyncState).not.toHaveBeenCalled()

        expect(scope).not.toBe(null)
        expect(scope.visible).toBe(true)
        expect(typeof scope.close).toBe('function')

        scope.close()
        await waitNT(wrapper.vm)
        await waitRAF()

        expect(spyRootEventNameSyncState).toHaveBeenCalled()
        expect(spyRootEventNameSyncState).toHaveBeenCalledTimes(1)
        expect(spyRootEventNameSyncState.mock.calls[0][0].id).toBe('test') // ID
        expect(spyRootEventNameSyncState.mock.calls[0][0].show).toBe(false) // Visible state

        expect(scope).not.toBe(null)
        expect(scope.visible).toBe(false)
        expect(typeof scope.close).toBe('function')

        wrapper.unmount()
    })
})