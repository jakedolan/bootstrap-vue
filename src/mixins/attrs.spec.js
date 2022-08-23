import { h, computed, onUpdated, onMounted } from 'vue';
import { mount } from '@vue/test-utils'
import { attrsMixin } from './attrs'

const isVue3 = true;
// Note: The following tests indirectly test `utils/cache`

describe('mixins > attrs', () => {

    it('works', async() => {
        const BTest = {
            name: 'BTest',
            mixins: [attrsMixin],
            inheritAttrs: false,
            render() {
                return h('section', {}, { default: () => [h('article', {...this.bvAttrs })] })
            }
        }
        const App = {
            name: 'App',
            props: {
                attrs: {
                    type: Object,
                    default: () => ({})
                }
            },
            render() {
                return h(BTest, {...this.attrs })
            }
        }

        const wrapper = mount(App)

        expect(wrapper).toBeDefined()
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.element.tagName).toBe('SECTION')

        const $test = wrapper.findComponent(BTest)

        expect($test.exists()).toBe(true)
        expect($test.vm).toBeDefined()

        const $section = $test.find('section')
        expect($section.exists()).toBe(true)

        const $article = $test.find('article')
        expect($article.exists()).toBe(true)

        expect($section.attributes()).toEqual({})
        expect($article.attributes()).toEqual({})

        expect($test.vm.bvAttrs).toBeDefined()
        expect($test.vm.bvAttrs.foo).toBeUndefined()
        expect($test.vm.bvAttrs.baz).toBeUndefined()

        // Correctly adds new attrs data
        await wrapper.setProps({
            attrs: { foo: 'bar' }
        })

        expect($section.attributes()).toEqual({})
        expect($article.attributes()).toEqual({ foo: 'bar' })
        expect($test.vm.bvAttrs.foo).toEqual('bar')
        expect($test.vm.bvAttrs.baz).toBeUndefined()

        // Correctly updates attrs data
        await wrapper.setProps({
            attrs: { foo: 'bar', baz: 'biz' }
        })

        expect($section.attributes()).toEqual({})
        expect($article.attributes()).toEqual({ foo: 'bar', baz: 'biz' })
        expect($test.vm.bvAttrs.foo).toEqual('bar')
        expect($test.vm.bvAttrs.baz).toEqual('biz')

        // Correctly removes attrs data
        await wrapper.setProps({
            attrs: { foo: 'bar' }
        })

        expect($section.attributes()).toEqual({})
        expect($article.attributes()).toEqual({ foo: 'bar' })
        expect($test.vm.bvAttrs.foo).toEqual('bar')
        expect($test.vm.bvAttrs.baz).toBeUndefined()

        // Correctly removes all attrs data
        await wrapper.setProps({ attrs: {} })

        expect($section.attributes()).toEqual({})
        expect($article.attributes()).toEqual({})
        expect($test.vm.bvAttrs.foo).toBeUndefined()
        expect($test.vm.bvAttrs.baz).toBeUndefined()

        wrapper.unmount()
    })

    it('does not re-render parent child components', async() => {
        let input1RenderCount = 0
        let input2RenderCount = 0

        const Input1 = {
            props: ['modelValue'],
            render() {
                input1RenderCount++;
                return h('input', {
                    ...this.$attrs,
                    value: this.modelValue,
                    onInput: e => this.$emit('update:modelValue', e.target.value)
                })
            }
        }
        const Input2 = {
            props: ['modelValue'],
            computed: {
                bvAttrs() {
                    return this.$attrs
                }
            },
            render() {
                input2RenderCount++;
                return h('input', {
                    ...this.bvAttrs,
                    value: this.modelValue,
                    onInput: e => this.$emit('update:modelValue', e.target.value)
                })
            }
        }

        const App1 = {
            props: ['value1', 'value2'],
            global: {
                components: { Input1 },
            },
            render() {
                return h('div', {}, {
                    default: () => [
                        h(Input1, { modelValue: this.value1, 'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value) }, { default: () => [] }),
                        h(Input1, { modelValue: this.value2, 'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value) }, { default: () => [] })
                    ]
                })
            }
        }

        const App2 = {
            props: ['value1', 'value2'],
            global: {
                components: { Input2 },
            },
            render() {
                return h('div', {}, {
                    default: () => [
                        h(Input2, { modelValue: this.value1, 'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value) }, { default: () => [] }),
                        h(Input2, { modelValue: this.value2, 'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value) }, { default: () => [] }),
                    ]
                })
            }
        };



        const wrapper1 = mount(App1);

        const wrapper2 = mount(App2)

        const $inputs1 = wrapper1.findAllComponents(Input1)
        expect($inputs1.length).toBe(2)
        expect($inputs1[0]).toBeDefined()
        expect($inputs1[0].vm.modelValue).toBe(undefined)
        expect($inputs1[1]).toBeDefined()
        expect($inputs1[1].vm.modelValue).toBe(undefined)
        expect(input1RenderCount).toBe(2)

        const $inputs2 = wrapper2.findAllComponents(Input2)

        expect($inputs2.length).toBe(2)
        expect($inputs2[0]).toBeDefined()
        expect($inputs2[0].vm.modelValue).toBe(undefined)
        expect($inputs2[1]).toBeDefined()
        expect($inputs2[1].vm.modelValue).toBe(undefined)
        expect(input2RenderCount).toBe(2)

        // Update the value for the first `Input1`
        await wrapper1.setProps({ value1: 'foo' })
        expect($inputs1[0].vm.modelValue).toBe('foo')
        expect($inputs1[1].vm.modelValue).toBe(undefined)

        // Both `Input1`'s are re-rendered (See: https://github.com/vuejs/vue/issues/7257)
        expect(input1RenderCount).toBe(4)

        // Update the value for the second `Input1`
        await wrapper1.setProps({ value2: 'bar' })
        expect($inputs1[0].vm.modelValue).toBe('foo')
        expect($inputs1[1].vm.modelValue).toBe('bar')

        // Both `Input1`'s are re-rendered (See: https://github.com/vuejs/vue/issues/7257)
        expect(input1RenderCount).toBe(6)

        // Update the value for the first `Input2`
        await wrapper2.setProps({ value1: 'foo' })
        expect($inputs2[0].vm.modelValue).toBe('foo')
        expect($inputs2[1].vm.modelValue).toBe(undefined)

        // VUE 2: With `attrsMixin` only the affected `Input2` is re-rendered
        // VUE 3: With $listeners now merged with $attrs seems to be rerendering both,
        //  not 100% sure why as it rerenders without the any listeners; possibly something under the hood how the listeners
        //  are merged into $attrs. (See: https://github.com/vuejs/vue/issues/7257)
        expect(input2RenderCount).toBe(4)

        // Update the value for the second `Input2`
        await wrapper2.setProps({ value2: 'bar' })
        expect($inputs2[0].vm.modelValue).toBe('foo')
        expect($inputs2[1].vm.modelValue).toBe('bar')

        // VUE 2: With `attrsMixin` only the affected `Input2` is re-rendered
        // VUE 3: With $listeners now merged with $attrs seems to be rerendering both,
        //  not 100% sure why as it rerenders without the any listeners; possibly something under the hood how the listeners
        //  are merged into $attrs. (See: https://github.com/vuejs/vue/issues/7257)
        expect(input2RenderCount).toBe(6)

        wrapper1.unmount()
        wrapper2.unmount()
    })

    // This was intended to test to see if the change behavior was different with the composition api and without the mixin.
    // Updates to re-renders are the same. I suspect this is all related to how parent/child rerenders happen.
    it('[Composition API] does not re-render parent child components', async() => {

        let input1RenderCount = 0
        let input2RenderCount = 0

        const Input1 = {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            setup(props, { attrs, emit }) {

                onMounted(() => {
                    input1RenderCount++;
                })

                onUpdated(() => {
                    input1RenderCount++;
                })

                return () => h('input', {
                    ...attrs,
                    value: props.modelValue,
                    onInput: e => emit('update:modelValue', e.target.value)
                })
            }
        }

        const Input2 = {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            setup(props, { attrs, emit }) {
                const bvAttrs = computed(() => {
                    return attrs;
                })

                onMounted(() => {
                    input2RenderCount++;
                })

                onUpdated(() => {
                    input2RenderCount++;
                })

                return () => h('input', {
                    ...bvAttrs,
                    value: props.modelValue,
                    onInput: e => emit('update:modelValue', e.target.value)
                })
            }
        }

        const App1 = {
            props: ['value1', 'value2'],
            setup(props, { emit }) {
                return () => h('div', {}, {
                    default: () => [
                        h(Input1, { modelValue: props.value1, 'onUpdate:modelValue': (value) => emit('update:modelValue', value) }, { default: () => [] }),
                        h(Input1, { modelValue: props.value2, 'onUpdate:modelValue': (value) => emit('update:modelValue', value) }, { default: () => [] })
                    ]
                })
            }
        }

        const App2 = {
            props: ['value1', 'value2'],
            setup(props, { emit }) {
                return () => h('div', {}, {
                    default: () => [
                        h(Input2, { modelValue: props.value1, 'onUpdate:modelValue': (value) => emit('update:modelValue', value) }, { default: () => [] }),
                        h(Input2, { modelValue: props.value2, 'onUpdate:modelValue': (value) => emit('update:modelValue', value) }, { default: () => [] }),
                    ]
                })
            }
        };


        const wrapper1 = mount(App1, {
            global: {
                components: { Input1 },
            }
        });
        const wrapper2 = mount(App2, {
            global: {
                components: { Input2 },
            }
        })

        const $inputs1 = wrapper1.findAllComponents(Input1)
        expect($inputs1.length).toBe(2)
        expect($inputs1[0]).toBeDefined()
        expect($inputs1[0].vm.modelValue).toBe(undefined)
        expect($inputs1[1]).toBeDefined()
        expect($inputs1[1].vm.modelValue).toBe(undefined)
        expect(input1RenderCount).toBe(2)

        const $inputs2 = wrapper2.findAllComponents(Input2)


        expect($inputs2.length).toBe(2)
        expect($inputs2[0]).toBeDefined()
        expect($inputs2[0].vm.modelValue).toBe(undefined)
        expect($inputs2[1]).toBeDefined()
        expect($inputs2[1].vm.modelValue).toBe(undefined)
        expect(input2RenderCount).toBe(2)

        // Update the value for the first `Input1`
        await wrapper1.setProps({ value1: 'foo' })
        expect($inputs1[0].vm.modelValue).toBe('foo')
        expect($inputs1[1].vm.modelValue).toBe(undefined)

        // Both `Input1`'s are re-rendered (See: https://github.com/vuejs/vue/issues/7257)
        expect(input1RenderCount).toBe(4)

        // Update the value for the second `Input1`
        await wrapper1.setProps({ value2: 'bar' })
        expect($inputs1[0].vm.modelValue).toBe('foo')
        expect($inputs1[1].vm.modelValue).toBe('bar')

        // Both `Input1`'s are re-rendered (See: https://github.com/vuejs/vue/issues/7257)
        expect(input1RenderCount).toBe(6)

        // Update the value for the first `Input2`
        await wrapper2.setProps({ value1: 'foo' })
        expect($inputs2[0].vm.modelValue).toBe('foo')
        expect($inputs2[1].vm.modelValue).toBe(undefined)

        // VUE 3: With $listeners now merged with $attrs seems to be rerendering both,
        //  not 100% sure why as it rerenders without the any listeners; possibly something under the hood how the listeners
        //  are merged into $attrs. (See: https://github.com/vuejs/vue/issues/7257)
        expect(input2RenderCount).toBe(4)

        // Update the value for the second `Input2`
        await wrapper2.setProps({ value2: 'bar' })
        expect($inputs2[0].vm.modelValue).toBe('foo')
        expect($inputs2[1].vm.modelValue).toBe('bar')

        // VUE 2: With `attrsMixin` only the affected `Input2` is re-rendered
        // VUE 3: With $listeners now merged with $attrs seems to be rerendering both,
        //  not 100% sure why as it rerenders without the any listeners; possibly something under the hood how the listeners
        //  are merged into $attrs. (See: https://github.com/vuejs/vue/issues/7257)
        expect(input2RenderCount).toBe(6)

        wrapper1.unmount()
        wrapper2.unmount()
    })
})
