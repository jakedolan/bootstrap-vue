import { mount } from '@vue/test-utils'
import { BTable } from './table'


const isVue3 = true;
const testItems = [{ a: 1, b: 2, c: 3 }]
const testFields = [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }, { key: 'c', label: 'C' }]

describe('table > thead events', () => {
    it('should not emit head-clicked event when a head cell is clicked and no head-clicked listener', async() => {
        if (isVue3) {
            // We can't track if we have an event listener in vue3 so we skip this test for vue 3
            return
        }
        const wrapper = mount(BTable, {
            props: {
                fields: testFields,
                items: testItems
            },
        })
        expect(wrapper).toBeDefined()
        const $rows = wrapper.findAll('thead > tr')
        expect($rows.length).toBe(1)
        const $ths = wrapper.findAll('thead > tr > th')
        expect($ths.length).toBe(testFields.length)
        expect(wrapper.emitted('head-clicked')).toBeUndefined()
        await $ths[0].trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()
        await $ths[1].trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()
        await $ths[2].trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()
    })

    it('should emit head-clicked event when a head cell is clicked', async() => {
        const wrapper = mount(BTable, {
            props: {
                fields: testFields,
                items: testItems
            },
            attrs: {
                // Head-clicked will only be emitted if there is a registered listener
                onHeadClicked: () => {}
            }
        })
        expect(wrapper).toBeDefined()
        const $rows = wrapper.findAll('thead > tr')
        expect($rows.length).toBe(1)
        const $ths = wrapper.findAll('thead > tr > th')
        expect($ths.length).toBe(testFields.length)
        expect(wrapper.emitted('head-clicked')).toBeUndefined()
        await $ths[0].trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeDefined()
        expect(wrapper.emitted('head-clicked').length).toBe(1)
        expect(wrapper.emitted('head-clicked')[0][0]).toEqual(testFields[0].key) // Field key
        expect(wrapper.emitted('head-clicked')[0][1]).toEqual(testFields[0]) // Field definition
        expect(wrapper.emitted('head-clicked')[0][2]).toBeInstanceOf(MouseEvent) // Event
        expect(wrapper.emitted('head-clicked')[0][3]).toBe(false) // Is footer

        await $ths[2].trigger('click')
        expect(wrapper.emitted('head-clicked').length).toBe(2)
        expect(wrapper.emitted('head-clicked')[1][0]).toEqual(testFields[2].key) // Field key
        expect(wrapper.emitted('head-clicked')[1][1]).toEqual(testFields[2]) // Field definition
        expect(wrapper.emitted('head-clicked')[1][2]).toBeInstanceOf(MouseEvent) // Event
        expect(wrapper.emitted('head-clicked')[1][3]).toBe(false) // Is footer

        wrapper.unmount()
    })

    it('should not emit head-clicked event when prop busy is set', async() => {
        const wrapper = mount(BTable, {
            props: {
                fields: testFields,
                items: testItems,
                busy: true
            },
            attrs: {
                // Head-clicked will only be emitted if there is a registered listener
                onHeadClicked: () => {}
            }
        })
        expect(wrapper).toBeDefined()
        const $ths = wrapper.findAll('thead > tr > th')
        expect($ths.length).toBe(testFields.length)
        expect(wrapper.emitted('head-clicked')).toBeUndefined()
        await $ths[0].trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()

        wrapper.unmount()
    })

    it('should not emit head-clicked event when vm.localBusy is true', async() => {
        const wrapper = mount(BTable, {
            props: {
                fields: testFields,
                items: testItems
            },
            attrs: {
                // Head-clicked will only be emitted if there is a registered listener
                onHeadClicked: () => {}
            }
        })
        await wrapper.setData({
            localBusy: true
        })
        expect(wrapper).toBeDefined()
        const $ths = wrapper.findAll('thead > tr > th')
        expect($ths.length).toBe(testFields.length)
        expect(wrapper.emitted('head-clicked')).toBeUndefined()
        await $ths[0].trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()

        wrapper.unmount()
    })

    it('should not emit head-clicked event when clicking on a button or other interactive element', async() => {
        const wrapper = mount(BTable, {
            props: {
                fields: testFields,
                items: testItems
            },
            attrs: {
                // Head-clicked will only be emitted if there is a registered listener
                onHeadClicked: () => {}
            },
            slots: {
                // In Vue 2.6x, slots get translated into scopedSlots
                'head(a)': '<button id="a">button</button>',
                'head(b)': '<input id="b">',
                'head(c)': '<a href="#" id="c">link</a>'
            }
        })
        expect(wrapper).toBeDefined()
        const $ths = wrapper.findAll('thead > tr > th')
        expect($ths.length).toBe(testFields.length)
        expect(wrapper.emitted('head-clicked')).toBeUndefined()

        const $btn = wrapper.find('button[id="a"]')
        expect($btn.exists()).toBe(true)
        await $btn.trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()

        const $input = wrapper.find('input[id="b"]')
        expect($input.exists()).toBe(true)
        await $input.trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()

        const $link = wrapper.find('a[id="c"]')
        expect($link.exists()).toBe(true)
        await $link.trigger('click')
        expect(wrapper.emitted('head-clicked')).toBeUndefined()

        wrapper.unmount()
    })
})
