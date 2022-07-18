import { h } from 'vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { mount } from '@vue/test-utils'
import { waitNT, waitRAF } from '../../../tests/utils'
import { BDropdownItem } from './dropdown-item'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: { name: 'R', template: '<div class="r">ROOT</div>' } },
        { path: '/a', component: { name: 'A', template: '<div class="a">A</div>' } },
        { path: '/b', component: { name: 'B', template: '<div class="a">B</div>' } }
    ]
})

describe('dropdown-item', () => {
    it('renders with tag "a" and href="#" by default', async() => {
        const wrapper = mount(BDropdownItem)
        expect(wrapper.element.tagName).toBe('LI')

        const item = wrapper.find('a')
        expect(item.element.tagName).toBe('A')
        expect(item.attributes('href')).toBe('#')

        wrapper.unmount()
    })

    it('has class "dropdown-item"', async() => {
        const wrapper = mount(BDropdownItem)
        expect(wrapper.element.tagName).toBe('LI')

        const item = wrapper.find('a')
        expect(item.classes()).toContain('dropdown-item')
        expect(item.attributes('href')).toBe('#')

        wrapper.unmount()
    })

    it('calls dropdown hide(true) method when clicked', async() => {
        let called = false
        let refocus = null
        const wrapper = mount(BDropdownItem, {
            global: {
                provide: {
                    getBvDropdown: () => ({
                        hide(arg) {
                            called = true
                            refocus = arg
                        }
                    })
                }
            }
        })
        expect(wrapper.element.tagName).toBe('LI')

        const item = wrapper.find('a')
        expect(item).toBeDefined()
        await item.trigger('click')
        await waitRAF()
        expect(called).toBe(true)
        expect(refocus).toBe(true)

        wrapper.unmount()
    })

    it('does not call dropdown hide(true) method when clicked and disabled', async() => {
        let called = false
        let refocus = null
        const wrapper = mount(BDropdownItem, {
            props: { disabled: true },
            global: {
                provide: {
                    getBvDropdown: () => ({
                        hide(arg) {
                            called = true
                            refocus = arg
                        }
                    })
                }
            }
        })
        expect(wrapper.element.tagName).toBe('LI')

        const item = wrapper.find('a')
        expect(item).toBeDefined()
        await item.trigger('click')
        await waitRAF()
        expect(called).toBe(false)
        expect(refocus).toBe(null)

        wrapper.unmount()
    })

    it('has linkClass when prop is passed a value', () => {
        const wrapper = mount(BDropdownItem, {
            props: {
                linkClass: 'link-class'
            }
        })
        expect(wrapper.element.tagName).toBe('LI')

        const item = wrapper.find('a')
        expect(item.classes()).toContain('link-class')
        expect(item.classes()).toContain('dropdown-item')

        wrapper.unmount()
    })

    describe('router-link support', () => {
        it('works', async() => {
            router.push('/')
            await router.isReady()

            const App = {
                render() {
                    return h('ul', {}, {
                        default: () => [
                            // <router-link>
                            h(BDropdownItem, { to: '/a' }, { default: () => ['to-a'] }),
                            // Regular link
                            h(BDropdownItem, { href: '/a' }, { default: () => ['href-a'] }),
                            // <router-link>
                            h(BDropdownItem, { to: { path: '/b' } }, { default: () => ['to-path-b'] }),
                            h('router-view')
                        ]
                    })
                }
            }

            const wrapper = mount(App, {
                attachTo: document.body,
                global: {
                    plugins: [router],
                }
            })

            await waitNT(wrapper.vm)
            await waitRAF()

            expect(wrapper.vm).toBeDefined()
            expect(wrapper.element.tagName).toBe('UL')

            expect(wrapper.findAll('li').length).toBe(3)
            expect(wrapper.findAll('a').length).toBe(3)

            const $links = wrapper.findAllComponents('a')

            $links.forEach(($link, i) => {
                expect($link.vm).toBeDefined()
                expect($links[i].vm.$options.name).toBe('BLink')
            })
            expect(
                $links.map($link => $link.findComponent({ name: 'RouterLink' }).exists())
            ).toStrictEqual([true, false, true])

            wrapper.unmount()
        })
    })
})