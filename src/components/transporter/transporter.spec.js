import { h } from 'vue';
import { mount } from '@vue/test-utils'
import { waitNT } from '../../../tests/utils'
import { getInstanceFromVNode } from '../../utils/get-instance-from-vnode'
import { BVTransporter } from './transporter'

const isVue3 = true;

describe('utils/transporter component', () => {
    it('renders in-pace when disabled=true', async() => {
        const App = {
            render() {
                return h(BVTransporter, { disabled: true }, [h('div', 'content')])
            }
        }

        const wrapper = mount(App, {
            attachTo: document.body
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.text()).toEqual('content')

        wrapper.unmount()
    })

    it('does not render in-pace when disabled=false', async() => {
        const App = {
            render() {
                return h(BVTransporter, { disabled: false }, [
                    h('div', { id: 'foobar' }, 'content')
                ])
            }
        }

        const wrapper = mount(App, {
            attachTo: document.body
        })

        expect(wrapper.vm).toBeDefined()

        await waitNT(wrapper.vm)

        expect(wrapper.element.nodeType).toBe(Node.COMMENT_NODE)

        const target = document.getElementById('foobar')
        expect(target).toBeDefined()
        expect(target).not.toBe(null)
        expect(getInstanceFromVNode(target)).toBeDefined() // Target
        if (!isVue3) {
            expect(getInstanceFromVNode(target).$options.name).toBe('BVTransporterTarget')
        }
        expect(target.tagName).toEqual('DIV')
        expect(target.parentElement).toBeDefined()
        expect(target.parentElement).toBe(document.body)

        wrapper.unmount()

        await waitNT(wrapper.vm)

        expect(target.parentElement).toEqual(null)
    })
})
