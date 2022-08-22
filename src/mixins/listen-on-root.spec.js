import { h } from 'vue';
import { mount } from '@vue/test-utils'
import { listenOnRootMixin } from './listen-on-root'
import { emitter } from '../utils/emitter.js'

describe('mixins/listen-on-root', () => {
    it('works', async() => {
        const spyOn = jest.fn()
        const spyOnce = jest.fn()

        const TestComponent = {
            mixins: [listenOnRootMixin],
            created() {
                this.listenOnRoot('root-on', spyOn)
                this.listenOnRootOnce('root-once', spyOnce)
            },
            render() {
                return h('div', {}, {
                    default: () => [this.$slots.default()]
                })
            }
        }

        const App = {
            components: { TestComponent },
            props: {
                destroy: {
                    type: Boolean,
                    default: false
                }
            },
            render() {
                return h('div', {}, {
                    default: () => [this.destroy ? null : h(TestComponent, {}, { default: () => ['test-component'] })]
                })
            }
        }

        const wrapper = mount(App, {
            props: {
                destroy: false
            }
        })

        expect(wrapper.vm).toBeDefined()
        expect(wrapper.text()).toEqual('test-component')

        expect(spyOn).not.toHaveBeenCalled()
        expect(spyOnce).not.toHaveBeenCalled()

        emitter.emit('root-on')
        expect(spyOn).toHaveBeenCalledTimes(1)
        expect(spyOnce).not.toHaveBeenCalled()

        emitter.emit('root-once')
        expect(spyOn).toHaveBeenCalledTimes(1)
        expect(spyOnce).toHaveBeenCalledTimes(1)

        emitter.emit('root-on')
        expect(spyOn).toHaveBeenCalledTimes(2)
        expect(spyOnce).toHaveBeenCalledTimes(1)

        emitter.emit('root-once')
        expect(spyOn).toHaveBeenCalledTimes(2)
        expect(spyOnce).toHaveBeenCalledTimes(1)

        await wrapper.setProps({ destroy: true })
        expect(spyOn).toHaveBeenCalledTimes(2)
        expect(spyOnce).toHaveBeenCalledTimes(1)

        emitter.emit('root-on')
        expect(spyOn).toHaveBeenCalledTimes(2)
        expect(spyOnce).toHaveBeenCalledTimes(1)

        emitter.emit('root-once')
        expect(spyOn).toHaveBeenCalledTimes(2)
        expect(spyOnce).toHaveBeenCalledTimes(1)

        wrapper.unmount()
    })
})
