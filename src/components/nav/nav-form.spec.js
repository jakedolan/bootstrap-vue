import { mount } from '@vue/test-utils'
import { BNavForm } from './nav-form'

describe('nav > nav-form', () => {
    it('has expected default structure', async() => {
        const wrapper = mount(BNavForm)

        expect(wrapper.element.tagName).toBe('LI')
        expect(wrapper.classes()).toContain('form-inline')
        expect(wrapper.classes().length).toBe(1)

        const $form = wrapper.find('form')
        expect($form.exists()).toBe(true)
        expect($form.classes()).toContain('form-inline')
        expect($form.classes().length).toBe(1)
        expect(wrapper.text()).toEqual('')

        wrapper.unmount()
    })

    it('renders default slot content', async() => {
        const wrapper = mount(BNavForm, {
            slots: {
                default: 'foobar'
            }
        })

        expect(wrapper.element.tagName).toBe('LI')
        expect(wrapper.classes()).toContain('form-inline')
        expect(wrapper.classes().length).toBe(1)

        const $form = wrapper.find('form')
        expect($form.exists()).toBe(true)
        expect($form.classes()).toContain('form-inline')
        expect($form.text()).toEqual('foobar')

        wrapper.unmount()
    })

    it('applies ID to form when prop ID is set', async() => {
        const wrapper = mount(BNavForm, {
            props: {
                id: 'baz'
            },
            slots: {
                default: 'foobar'
            }
        })

        expect(wrapper.element.tagName).toBe('LI')
        expect(wrapper.classes()).toContain('form-inline')
        expect(wrapper.classes().length).toBe(1)

        const $form = wrapper.find('form')
        expect($form.exists()).toBe(true)
        expect($form.classes()).toContain('form-inline')
        expect($form.text()).toEqual('foobar')
        expect($form.attributes('id')).toEqual('baz')

        wrapper.unmount()
    })

    it('listeners are bound to form element', async() => {
        const onSubmit = jest.fn()
        const wrapper = mount(BNavForm, {
            props: {
                id: 'baz'
            },
            attrs: {
                onSubmit: onSubmit
            },
            slots: {
                default: 'foobar'
            }
        })

        expect(wrapper.element.tagName).toBe('LI')
        expect(wrapper.classes()).toContain('form-inline')
        expect(wrapper.classes().length).toBe(1)

        const $form = wrapper.find('form')
        expect($form.exists()).toBe(true)
        expect($form.classes()).toContain('form-inline')
        expect($form.text()).toEqual('foobar')

        expect(onSubmit).not.toHaveBeenCalled()

        await $form.trigger('submit')
        expect(onSubmit).toHaveBeenCalled()

        wrapper.unmount()
    })
})