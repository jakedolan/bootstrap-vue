import { config as vtuConfig, mount } from '@vue/test-utils'
import { TransitionGroupStub } from '../../../tests/components'
import { BTable } from './table'

const isVue3 = true;
// Stub `<transition-group>` component
if (!isVue3) {
    vtuConfig.stubs['transition-group'] = TransitionGroupStub
}

const testItems = [{ a: 1, b: 2, c: 3 }, { a: 5, b: 5, c: 6 }, { a: 7, b: 8, c: 9 }]
const testFields = ['a', 'b', 'c']

describe('table > tbody transition', () => {
    if (isVue3) {
        // @vue/test-utils does not support stubbing transition, so impossible to test ATM

        // adding dummy test to keep jest happy
        it('skipped due to vue3', () => {})
        return
    }

    it('tbody should not be a transition-group component by default', async() => {
        const wrapper = mount(BTable, {
            attachTo: document.body,
            props: {
                fields: testFields,
                items: testItems
            }
        })
        expect(wrapper).toBeDefined()
        expect(wrapper.element.tagName).toBe('TABLE')
        expect(wrapper.find('tbody').exists()).toBe(true)
        expect(wrapper.find('tbody').element.tagName).toBe('TBODY')
            // `<transition-group>` stub doesn't render itself with the specified tag
        expect(wrapper.findComponent(TransitionGroupStub).exists()).toBe(false)

        wrapper.unmount()
    })

    it('tbody should be a transition-group component when tbody-transition-props set', async() => {
        const wrapper = mount(BTable, {
            attachTo: document.body,
            props: {
                fields: testFields,
                items: testItems,
                tbodyTransitionProps: {
                    name: 'fade'
                }
            }
        })
        expect(wrapper).toBeDefined()
        expect(wrapper.element.tagName).toBe('TABLE')
            // `<transition-group>` stub doesn't render itself with the specified tag
        expect(wrapper.findComponent(TransitionGroupStub).exists()).toBe(true)
        expect(wrapper.find('tbody').exists()).toBe(false)

        wrapper.unmount()
    })

    it('tbody should be a transition-group component when tbody-transition-handlers set', async() => {
        const wrapper = mount(BTable, {
            attachTo: document.body,
            props: {
                fields: testFields,
                items: testItems,
                tbodyTransitionHandlers: {
                    onBeforeEnter: () => {},
                    onAfterEnter: () => {},
                    onBeforeLeave: () => {},
                    onAfterLeave: () => {}
                }
            }
        })
        expect(wrapper).toBeDefined()
        expect(wrapper.element.tagName).toBe('TABLE')
            // `<transition-group>` stub doesn't render itself with the specified tag
        expect(wrapper.findComponent(TransitionGroupStub).exists()).toBe(true)
        expect(wrapper.find('tbody').exists()).toBe(false)

        wrapper.unmount()
    })
})