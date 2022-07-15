import { mount } from '@vue/test-utils'
import { IconsPlugin } from '../../icons'
import { Vue } from '../../vue'
import { BSkeletonIcon } from './skeleton-icon'

Vue.use(IconsPlugin)

describe('skeleton-icon', () => {
    it('root element is DIV and contains SVG', async() => {
        const wrapper = mount(BSkeletonIcon)

        expect(wrapper).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.find('svg').exists()).toBe(true)

        wrapper.unmount()
    })

    it('default animation is `wave`', async() => {
        const wrapper = mount(BSkeletonIcon)

        expect(wrapper).toBeDefined()
        expect(wrapper.classes()).toContain('b-skeleton-animate-wave')

        wrapper.unmount()
    })

    it('has class `b-skeleton-animate-fade` when `animation="fade"` is set', async() => {
        const wrapper = mount(BSkeletonIcon, {
            props: {
                animation: 'fade'
            }
        })

        expect(wrapper).toBeDefined()
        expect(wrapper.classes()).toContain('b-skeleton-animate-fade')

        wrapper.unmount()
    })

    it('`icon` prop works', async() => {
        const wrapper = mount(BSkeletonIcon, {
            props: {
                icon: 'heart'
            }
        })

        expect(wrapper).toBeDefined()
        expect(wrapper.find('svg').exists()).toBe(true)
        expect(wrapper.find('svg').classes()).toContain('bi-heart')

        wrapper.unmount()
    })

    it('`icon-props` is passed correctly to icon', async() => {
        const wrapper = mount(BSkeletonIcon, {
            props: {
                icon: 'heart',
                iconProps: {
                    fontScale: 2,
                    variant: 'primary'
                }
            }
        })

        expect(wrapper).toBeDefined()
        expect(wrapper.find('svg').exists()).toBe(true)
        expect(wrapper.find('svg').classes()).toContain('text-primary')
        expect(wrapper.find('svg').element.style.fontSize).toBe('200%')

        wrapper.unmount()
    })

    it('accepts custom classes', async() => {
        const wrapper = mount(BSkeletonIcon, {
            context: {
                class: ['foobar']
            }
        })

        expect(wrapper.classes()).toContain('b-skeleton-icon-wrapper')
        expect(wrapper.classes()).toContain('foobar')

        wrapper.unmount()
    })
})