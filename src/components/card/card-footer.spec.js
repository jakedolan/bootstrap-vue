import { mount } from '@vue/test-utils'
import { BCardFooter } from './card-footer'

describe('card-footer', () => {
    it('has root element "div"', async() => {
        const wrapper = mount(BCardFooter)

        expect(wrapper.element.tagName).toBe('DIV')

        wrapper.unmount()
    })

    it('has class card-header', async() => {
        const wrapper = mount(BCardFooter)

        expect(wrapper.classes()).toContain('card-footer')
        expect(wrapper.classes().length).toBe(1)

        wrapper.unmount()
    })

    it('has custom root element when prop footerTag is set', async() => {
        const wrapper = mount(BCardFooter, {

            props: {
                footerTag: 'footer'
            }

        })

        expect(wrapper.element.tagName).toBe('FOOTER')
        expect(wrapper.classes()).toContain('card-footer')

        wrapper.unmount()
    })

    it('has class bg-info when prop footerBgVariant=info', async() => {
        const wrapper = mount(BCardFooter, {
            props: { footerBgVariant: 'info' }

        })

        expect(wrapper.classes()).toContain('card-footer')
        expect(wrapper.classes()).toContain('bg-info')
        expect(wrapper.classes().length).toBe(2)

        wrapper.unmount()
    })

    it('has class text-info when prop footerTextVariant=info', async() => {
        const wrapper = mount(BCardFooter, {

            props: { footerTextVariant: 'info' }

        })

        expect(wrapper.classes()).toContain('card-footer')
        expect(wrapper.classes()).toContain('text-info')
        expect(wrapper.classes().length).toBe(2)

        wrapper.unmount()
    })

    it('has class border-info when prop footerBorderVariant=info', async() => {
        const wrapper = mount(BCardFooter, {
            props: { footerBorderVariant: 'info' }

        })

        expect(wrapper.classes()).toContain('card-footer')
        expect(wrapper.classes()).toContain('border-info')
        expect(wrapper.classes().length).toBe(2)

        wrapper.unmount()
    })

    it('has all variant classes when all variant props set', async() => {
        const wrapper = mount(BCardFooter, {
            props: {
                footerTextVariant: 'info',
                footerBgVariant: 'danger',
                footerBorderVariant: 'dark'
            }

        })

        expect(wrapper.classes()).toContain('card-footer')
        expect(wrapper.classes()).toContain('text-info')
        expect(wrapper.classes()).toContain('bg-danger')
        expect(wrapper.classes()).toContain('border-dark')
        expect(wrapper.classes().length).toBe(4)

        wrapper.unmount()
    })
})
