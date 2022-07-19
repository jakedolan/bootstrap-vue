import { createLocalVue, mount } from '@vue/test-utils'
import { BIconPerson } from '../../icons/icons'
import { BAvatar } from './avatar'

describe('avatar', () => {
    it('should have expected default structure', async() => {
        const wrapper = mount(BAvatar)
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('SPAN')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('badge-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeUndefined()
        expect(wrapper.attributes('type')).toBeUndefined()
        wrapper.unmount()
    })

    it('should have expected structure when prop `button` set', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                button: true
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('BUTTON')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('btn-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeUndefined()
        expect(wrapper.attributes('type')).toBeDefined()
        expect(wrapper.attributes('type')).toEqual('button')
        expect(wrapper.text()).toEqual('')
        expect(wrapper.find('.b-icon').exists()).toBe(true)
        expect(wrapper.find('img').exists()).toBe(false)

        expect(wrapper.emitted('click')).toBeUndefined()

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).not.toBeUndefined()
        expect(wrapper.emitted('click').length).toBe(1)
        expect(wrapper.emitted('click')[0][0]).toBeInstanceOf(Event)

        wrapper.unmount()
    })

    it('should have expected structure when prop `href` set', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                href: '#foo'
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('A')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('badge-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeDefined()
        expect(wrapper.attributes('href')).toEqual('#foo')
        expect(wrapper.attributes('type')).toBeUndefined()
        expect(wrapper.attributes('type')).not.toEqual('button')
        expect(wrapper.text()).toEqual('')
        expect(wrapper.find('.b-icon').exists()).toBe(true)
        expect(wrapper.find('img').exists()).toBe(false)

        expect(wrapper.emitted('click')).toBeUndefined()

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).not.toBeUndefined()
        expect(wrapper.emitted('click').length).toBe(1)
        expect(wrapper.emitted('click')[0][0]).toBeInstanceOf(Event)

        wrapper.unmount()
    })

    it('should have expected structure when prop `text` set', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                text: 'BV'
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('SPAN')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('badge-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeUndefined()
        expect(wrapper.attributes('type')).toBeUndefined()
        expect(wrapper.text()).toContain('BV')
        expect(wrapper.find('.b-icon').exists()).toBe(false)
        expect(wrapper.find('img').exists()).toBe(false)
        wrapper.unmount()
    })

    it('should have expected structure when default slot used', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                text: 'FOO'
            },
            slots: {
                default: 'BAR'
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('SPAN')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('badge-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeUndefined()
        expect(wrapper.attributes('type')).toBeUndefined()
        expect(wrapper.text()).toContain('BAR')
        expect(wrapper.text()).not.toContain('FOO')
        expect(wrapper.find('.b-icon').exists()).toBe(false)
        expect(wrapper.find('img').exists()).toBe(false)
        wrapper.unmount()
    })

    it('should have expected structure when prop `src` set', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                src: '/foo/bar',
                text: 'BV'
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('SPAN')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('badge-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeUndefined()
        expect(wrapper.attributes('type')).toBeUndefined()
        expect(wrapper.text()).toEqual('')
        expect(wrapper.find('.b-icon').exists()).toBe(false)
        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toEqual('/foo/bar')
        expect(wrapper.text()).not.toContain('BV')

        await wrapper.setProps({ src: '/foo/baz' })
        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toEqual('/foo/baz')
        expect(wrapper.text()).not.toContain('BV')
        expect(wrapper.emitted('img-error')).toBeUndefined()
        expect(wrapper.text()).not.toContain('BV')

        // Fake an image error
        await wrapper.find('img').trigger('error')
        expect(wrapper.emitted('img-error')).toBeDefined()
        expect(wrapper.emitted('img-error').length).toBe(1)
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.text()).toContain('BV')

        wrapper.unmount()
    })

    it('should have expected structure when prop `icon` set', async() => {
        const localVue = createLocalVue()
        localVue.component('BIconPerson', BIconPerson)

        const wrapper = mount(BAvatar, {
            localVue,
            props: {
                icon: 'person'
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('SPAN')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('badge-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeUndefined()
        expect(wrapper.attributes('type')).toBeUndefined()
        expect(wrapper.text()).toEqual('')
        const $icon = wrapper.find('.b-icon')
        expect($icon.exists()).toBe(true)
        expect($icon.classes()).toContain('bi-person')
        wrapper.unmount()
    })

    it('`size` prop should work as expected', async() => {
        const wrapper1 = mount(BAvatar)
        expect(wrapper1.attributes('style')).toEqual(undefined)
        wrapper1.destroy()

        const wrapper2 = mount(BAvatar, { props: { size: 'sm' } })
        expect(wrapper2.attributes('style')).toEqual(undefined)
        expect(wrapper2.classes()).toContain('b-avatar-sm')
        wrapper2.destroy()

        const wrapper3 = mount(BAvatar, { props: { size: 'md' } })
        expect(wrapper3.attributes('style')).toEqual(undefined)
        expect(wrapper3.classes()).not.toContain('b-avatar-md')
        wrapper3.destroy()

        const wrapper4 = mount(BAvatar, { props: { size: 'lg' } })
        expect(wrapper4.attributes('style')).toEqual(undefined)
        expect(wrapper4.classes()).toContain('b-avatar-lg')
        wrapper4.destroy()

        const wrapper5 = mount(BAvatar, { props: { size: 20 } })
        expect(wrapper5.attributes('style')).toEqual('width: 20px; height: 20px;')
        wrapper5.destroy()

        const wrapper6 = mount(BAvatar, { props: { size: '24.5' } })
        expect(wrapper6.attributes('style')).toEqual('width: 24.5px; height: 24.5px;')
        wrapper6.destroy()

        const wrapper7 = mount(BAvatar, { props: { size: '5em' } })
        expect(wrapper7.attributes('style')).toEqual('width: 5em; height: 5em;')
        wrapper7.destroy()

        const wrapper8 = mount(BAvatar, { props: { size: '36px' } })
        expect(wrapper8.attributes('style')).toEqual('width: 36px; height: 36px;')
        wrapper8.destroy()
    })

    it('should have expected structure when prop badge is set', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                badge: true
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('SPAN')
        expect(wrapper.classes()).toContain('b-avatar')
        expect(wrapper.classes()).toContain('badge-secondary')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('href')).toBeUndefined()
        expect(wrapper.attributes('type')).toBeUndefined()

        const $badge = wrapper.find('.b-avatar-badge')
        expect($badge.exists()).toBe(true)
        expect($badge.classes()).toContain('badge-primary')
        expect($badge.text()).toEqual('')

        await wrapper.setProps({ badge: 'FOO' })
        expect($badge.classes()).toContain('badge-primary')
        expect($badge.text()).toEqual('FOO')

        await wrapper.setProps({ badgeVariant: 'info' })
        expect($badge.classes()).not.toContain('badge-primary')
        expect($badge.classes()).toContain('badge-info')
        expect($badge.text()).toEqual('FOO')

        wrapper.unmount()
    })

    it('should handle b-avatar-group variant', async() => {
        const wrapper1 = mount(BAvatar, {
            global: {
                provide: {
                    // Emulate `undefined`/`null` props
                    getBvAvatarGroup: () => ({})
                }
            }
        })

        expect(wrapper1.vm).toBeDefined()
        expect(wrapper1.element.tagName).toBe('SPAN')
        expect(wrapper1.classes()).toContain('b-avatar')
        expect(wrapper1.classes()).toContain('badge-secondary')
            // Uses avatar group size (default)
        expect(wrapper1.attributes('style')).toBe(undefined)

        wrapper1.destroy()

        const wrapper2 = mount(BAvatar, {
            global: {
                provide: {
                    getBvAvatarGroup: () => ({
                        variant: 'danger'
                    })
                }
            }
        })

        expect(wrapper2.vm).toBeDefined()
        expect(wrapper2.element.tagName).toBe('SPAN')
        expect(wrapper2.classes()).toContain('b-avatar')
        expect(wrapper2.classes()).toContain('badge-danger')
        expect(wrapper2.classes()).not.toContain('badge-secondary')
            // Uses avatar group size (default)
        expect(wrapper2.attributes('style')).toBe(undefined)

        wrapper2.destroy()
    })

    it('should handle b-avatar-group size', async() => {
        const wrapper1 = mount(BAvatar, {
            props: {
                size: '5em'
            },
            global: {
                provide: {
                    // Emulate `undefined`/`null` props
                    getBvAvatarGroup: () => ({})
                }
            }
        })

        expect(wrapper1.vm).toBeDefined()
        expect(wrapper1.element.tagName).toBe('SPAN')
        expect(wrapper1.classes()).toContain('b-avatar')
        expect(wrapper1.classes()).toContain('badge-secondary')
            // Uses avatar group size (default)
        expect(wrapper1.attributes('style')).toBe(undefined)

        wrapper1.destroy()

        const wrapper2 = mount(BAvatar, {
            props: {
                size: '2em'
            },
            global: {
                provide: {
                    getBvAvatarGroup: () => ({
                        size: '5em'
                    })
                }
            }
        })

        expect(wrapper2.vm).toBeDefined()
        expect(wrapper2.element.tagName).toBe('SPAN')
        expect(wrapper2.classes()).toContain('b-avatar')
        expect(wrapper2.classes()).toContain('badge-secondary')
            // Should use BAvatarGroup size prop
        expect(wrapper2.attributes('style')).toContain('width: 5em; height: 5em;')

        wrapper2.destroy()
    })

    it('should render `alt` attribute if `alt` prop is empty string', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                src: '/foo/bar',
                alt: ''
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toEqual('/foo/bar')
        expect(wrapper.find('img').attributes('alt')).toEqual('')

        wrapper.unmount()
    })

    it('should not render `alt` attribute if `alt` prop is null', async() => {
        const wrapper = mount(BAvatar, {
            props: {
                src: '/foo/bar',
                alt: null
            }
        })
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toEqual('/foo/bar')
        expect(wrapper.find('img').attributes('alt')).toBeUndefined()

        wrapper.unmount()
    })
})