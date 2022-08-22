import { h } from 'vue';
import { mount } from '@vue/test-utils'
import { listenersMixin } from './listeners'


const isVue3 = true;
// Note: The following tests indirectly test `utils/cache`

describe('mixins > listeners', () => {
    it('works', async() => {
        const BTest = {
            name: 'BTest',
            mixins: [listenersMixin],
            inheritAttrs: false,
            render() {
                return h('button', {...this.bvListeners })
            }
        }
        const App = {
            name: 'App',
            props: ['listenClick', 'listenFocus', 'listenBlur'],
            computed: {
                listeners() {
                    const listeners = {}
                    if (this.listenClick) {
                        listeners.onCllick = event => this.$emit('click', event)
                    }
                    if (this.listenFocus) {
                        listeners.onFocus = event => this.$emit('focus', event)
                    }
                    if (this.listenBlur) {
                        listeners.onBlur = event => this.$emit('blur', event)
                    }
                    return listeners
                }
            },
            render() {
                return h(BTest, {...this.listeners })
            }
        }

        const wrapper = mount(App)

        expect(wrapper).toBeDefined()
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('BUTTON')

        const $test = wrapper.findComponent(BTest)

        expect($test.exists()).toBe(true)
        expect($test.vm).toBeDefined()

        expect($test.vm.bvListeners).toBeDefined()
        expect($test.vm.bvListeners.click).toBeUndefined()
        expect($test.vm.bvListeners.focus).toBeUndefined()
        expect($test.vm.bvListeners.blur).toBeUndefined()

        // Correctly adds new listeners
        await wrapper.setProps({
            listenClick: true,
            listenFocus: true
        })

        expect($test.vm.bvListeners.click).toBeDefined()
        expect($test.vm.bvListeners.focus).toBeDefined()
        expect($test.vm.bvListeners.blur).toBeUndefined()

        // Correctly updates listeners
        await wrapper.setProps({
            listenClick: false,
            listenBlur: true
        })

        expect($test.vm.bvListeners.click).toBeUndefined()
        expect($test.vm.bvListeners.focus).toBeDefined()
        expect($test.vm.bvListeners.blur).toBeDefined()

        // Correctly removes listeners
        await wrapper.setProps({
            listenClick: false,
            listenFocus: false,
            listenBlur: false
        })

        expect($test.vm.bvListeners.click).toBeUndefined()
        expect($test.vm.bvListeners.focus).toBeUndefined()
        expect($test.vm.bvListeners.blur).toBeUndefined()

        wrapper.unmount()
    })

    it('does not re-render parent child components', async() => {
        let input1RenderCount = 0
        let input2RenderCount = 0

        const Input1 = {
            props: ['value'],
            render() {
                input1RenderCount++
                return h('input', {
                    ...this.$attrs,
                    value: this.value,
                    // Unclear to me when this would and not be an attribute. So commented it out.
                    // domProps: { value: this.value },
                    onInput: e => this.$emit('input', e.target.value)
                })
            }
        }
        const Input2 = {
            props: ['value'],
            mixins: [listenersMixin],
            render() {
                input2RenderCount++
                return h('input', {
                    value: this.value,
                    ...this.bvListeners,
                    onInput: e => this.$emit('input', e.target.value)
                })
            }
        }

        const App1 = {
            components: { Input1 },
            props: ['listenFocus1', 'listenFocus2'],
            methods: {
                emit1($event) {
                    if (this.listenFocus1) {
                        this.$emit('focus1', $event)
                    }
                },
                emit2($event) {
                    if (this.listenFocus2) {
                        this.$emit('focus2', $event)
                    }
                }
            },
            template: `<div>
        <Input1 @focus="emit1" />
        <Input1 @focus="emit2" />
      </div>`
        }
        const App2 = {
            components: { Input2 },
            props: ['listenFocus1', 'listenFocus2'],
            methods: {
                emit1($event) {
                    if (this.listenFocus1) {
                        this.$emit('focus1', $event)
                    }
                },
                emit2($event) {
                    if (this.listenFocus2) {
                        this.$emit('focus2', $event)
                    }
                }
            },
            template: `<div>
        <Input2 @focus="emit1" />
        <Input2 @focus="emit2" />
      </div>`
        }

        const wrapper1 = mount(App1, { attachTo: document.body })
        const wrapper2 = mount(App2, { attachTo: document.body })

        // --- `Input1` tests ---

        const $inputs1 = wrapper1.findAllComponents(Input1)
        expect($inputs1.length).toBe(2)
        expect($inputs1[0]).toBeDefined()
        expect($inputs1[1]).toBeDefined()
        expect(wrapper1.emitted().focus1).not.toBeTruthy()
        expect(wrapper1.emitted().focus2).not.toBeTruthy()
        expect(input1RenderCount).toBe(2)

        await $inputs1[0].trigger('focus')
        expect(wrapper1.emitted().focus1).not.toBeTruthy()
        await $inputs1[1].trigger('focus')
        expect(wrapper1.emitted().focus2).not.toBeTruthy()
        expect(input1RenderCount).toBe(2)

        // Enable focus events for the first input and trigger it
        await wrapper1.setProps({ listenFocus1: true })
        await $inputs1[0].trigger('focus')
        expect(wrapper1.emitted().focus1).toBeTruthy()
        expect(wrapper1.emitted().focus2).not.toBeTruthy()
            // Both `Input1`'s are re-rendered (See: https://github.com/vuejs/vue/issues/7257)
        expect(input1RenderCount).toBe(isVue3 ? 2 : 4)

        // Enable focus events for the second input and trigger it
        await wrapper1.setProps({ listenFocus2: true })
        await $inputs1[1].trigger('focus')
        expect(wrapper1.emitted().focus1).toBeTruthy()
        expect(wrapper1.emitted().focus2).toBeTruthy()
            // Both `Input1`'s are re-rendered (See: https://github.com/vuejs/vue/issues/7257)
        expect(input1RenderCount).toBe(isVue3 ? 2 : 6)

        // --- `Input2` tests ---

        const $inputs2 = wrapper2.findAllComponents(Input2)
        expect($inputs2.length).toBe(2)
        expect($inputs2[0]).toBeDefined()
        expect($inputs2[1]).toBeDefined()
        expect(wrapper2.emitted().focus1).not.toBeTruthy()
        expect(wrapper2.emitted().focus2).not.toBeTruthy()
        expect(input2RenderCount).toBe(2)

        await $inputs2[0].trigger('focus')
        expect(wrapper2.emitted().focus1).not.toBeTruthy()
        await $inputs2[1].trigger('focus')
        expect(wrapper2.emitted().focus2).not.toBeTruthy()
        expect(input2RenderCount).toBe(2)

        // Enable focus events for the first input and trigger it
        await wrapper2.setProps({ listenFocus1: true })
        await $inputs2[0].trigger('focus')
        expect(wrapper2.emitted().focus1).toBeTruthy()
        expect(wrapper2.emitted().focus2).not.toBeTruthy()
            // With `listenersMixin` only the affected `Input2` is re-rendered
        expect(input2RenderCount).toBe(2)

        // Enable focus events for the second input and trigger it
        await wrapper2.setProps({ listenFocus2: true })
        await $inputs2[1].trigger('focus')
        expect(wrapper2.emitted().focus1).toBeTruthy()
        expect(wrapper2.emitted().focus2).toBeTruthy()
            // With `listenersMixin` only the affected `Input2` is re-rendered
        expect(input2RenderCount).toBe(2)

        wrapper1.destroy()
        wrapper2.destroy()
    })
})
