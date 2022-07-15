import { mount } from '@vue/test-utils'
import { BButton } from './button'

describe('button', () => {
                it('has default structure and classes', async() => {
                    const wrapper = mount(BButton)

                    expect(wrapper.element.tagName).toBe('BUTTON')
                    expect(wrapper.attributes('type')).toBeDefined()
                    expect(wrapper.attributes('type')).toBe('button')
                    expect(wrapper.classes()).toContain('btn')
                    expect(wrapper.classes()).toContain('btn-secondary')
                    expect(wrapper.classes().length).toBe(2)
                    expect(wrapper.attributes('href')).toBeUndefined()
                    expect(wrapper.attributes('role')).toBeUndefined()
                    expect(wrapper.attributes('disabled')).toBeUndefined()
                    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
                    expect(wrapper.attributes('aria-pressed')).toBeUndefined()
                    expect(wrapper.attributes('autocomplete')).toBeUndefined()
                    expect(wrapper.attributes('tabindex')).toBeUndefined()

                    wrapper.unmount()
                })
    
            it('renders a link when href provided', async() => {
                    const wrapper = mount(BButton, {
                        props: {
                            href: '/foo/bar'
                        }
                    })
                    
                    expect(wrapper.element.tagName).toBe('A')
                    expect(wrapper.attributes('href')).toBeDefined()
                    expect(wrapper.attributes('href')).toBe('/foo/bar')
                    expect(wrapper.attributes('type')).toBeUndefined()
                    expect(wrapper.classes()).toContain('btn')
                    expect(wrapper.classes()).toContain('btn-secondary')
                    expect(wrapper.classes().length).toBe(2)
                    expect(wrapper.attributes('role')).toBeUndefined()
                    expect(wrapper.attributes('disabled')).toBeUndefined()
                    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
                    expect(wrapper.attributes('aria-pressed')).toBeUndefined()
                    expect(wrapper.attributes('autocomplete')).toBeUndefined()
                    expect(wrapper.attributes('tabindex')).toBeUndefined()

                    wrapper.unmount()
                })

            it('renders default slot content', async() => {
                const wrapper = mount(BButton, {
                    slots: {
                        default: '<span>foobar</span>'
                    }
                })

                expect(wrapper.element.tagName).toBe('BUTTON')
                expect(wrapper.attributes('type')).toBeDefined()
                expect(wrapper.attributes('type')).toBe('button')
                expect(wrapper.classes()).toContain('btn')
                expect(wrapper.classes()).toContain('btn-secondary')
                expect(wrapper.classes().length).toBe(2)
                expect(wrapper.find('span').exists()).toBe(true)
                expect(wrapper.text()).toBe('foobar')

                wrapper.unmount()
            })

            it('applies variant class', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        variant: 'danger'
                    }
                })

                expect(wrapper.element.tagName).toBe('BUTTON')
                expect(wrapper.attributes('type')).toBeDefined()
                expect(wrapper.attributes('type')).toBe('button')
                expect(wrapper.classes()).toContain('btn')
                expect(wrapper.classes()).toContain('btn-danger')
                expect(wrapper.classes().length).toBe(2)

                wrapper.unmount()
            })

            it('applies block class', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        block: true
                    }
                })

                expect(wrapper.element.tagName).toBe('BUTTON')
                expect(wrapper.attributes('type')).toBeDefined()
                expect(wrapper.attributes('type')).toBe('button')
                expect(wrapper.classes()).toContain('btn')
                expect(wrapper.classes()).toContain('btn-secondary')
                expect(wrapper.classes()).toContain('btn-block')
                expect(wrapper.classes().length).toBe(3)

                wrapper.unmount()
            })

            it('applies rounded-pill class when pill prop set', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        pill: true
                    }
                })

                expect(wrapper.element.tagName).toBe('BUTTON')
                expect(wrapper.attributes('type')).toBeDefined()
                expect(wrapper.attributes('type')).toBe('button')
                expect(wrapper.classes()).toContain('btn')
                expect(wrapper.classes()).toContain('btn-secondary')
                expect(wrapper.classes()).toContain('rounded-pill')
                expect(wrapper.classes().length).toBe(3)

                wrapper.unmount()
            })

            it('applies rounded-0 class when squared prop set', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        squared: true
                    }
                })

                expect(wrapper.element.tagName).toBe('BUTTON')
                expect(wrapper.attributes('type')).toBeDefined()
                expect(wrapper.attributes('type')).toBe('button')
                expect(wrapper.classes()).toContain('btn')
                expect(wrapper.classes()).toContain('btn-secondary')
                expect(wrapper.classes()).toContain('rounded-0')
                expect(wrapper.classes().length).toBe(3)

                wrapper.unmount()
            })

            it('renders custom root element', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        tag: 'div'
                    }
                })

                expect(wrapper.element.tagName).toBe('DIV')
                expect(wrapper.attributes('type')).toBeUndefined()
                expect(wrapper.classes()).toContain('btn')
                expect(wrapper.classes()).toContain('btn-secondary')
                expect(wrapper.classes().length).toBe(2)
                expect(wrapper.attributes('role')).toBe('button')
                expect(wrapper.attributes('aria-disabled')).toBeUndefined()
                expect(wrapper.attributes('tabindex')).toBe('0')
                expect(wrapper.attributes('disabled')).toBeUndefined()
                expect(wrapper.attributes('aria-pressed')).toBeUndefined()
                expect(wrapper.attributes('autocomplete')).toBeUndefined()

                wrapper.unmount()
            })


            it('button has attribute disabled when disabled set', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        disabled: true
                    }
                })

                expect(wrapper.element.tagName).toBe('BUTTON')
                expect(wrapper.attributes('type')).toBe('button')
                expect(wrapper.classes()).toContain('btn')
                expect(wrapper.classes()).toContain('btn-secondary')
                expect(wrapper.classes()).toContain('disabled')
                expect(wrapper.classes().length).toBe(3)
                expect(wrapper.attributes('aria-disabled')).toBeUndefined()

                wrapper.unmount()
            })

            it('link has attribute aria-disabled when disabled set', async() => {
                    const wrapper = mount(BButton, {
                        props: {
                            href: '/foo/bar',
                            disabled: true
                        }
                    })

                    expect(wrapper.element.tagName).toBe('A')
                    expect(wrapper.classes()).toContain('btn')
                    expect(wrapper.classes()).toContain('btn-secondary')
                    expect(wrapper.classes()).toContain('disabled')
                        // Both <b-button> and <b-link> add the class 'disabled'
                        // `vue-functional-data-merge` or Vue doesn't appear to de-dup classes
                        // expect(wrapper.classes().length).toBe(3)
                        // Actually returns 4, as disabled is there twice
                    expect(wrapper.attributes('aria-disabled')).toBeDefined()
                    expect(wrapper.attributes('aria-disabled')).toBe('true')
                        // Shouldn't have a role with href not `#`
                    expect(wrapper.attributes('role')).not.toEqual('button')

                    wrapper.unmount()
                })


                  it('link with href="#" should have role="button"', async () => {
                    const wrapper = mount(BButton, {
                      props: {
                        href: '#'
                      }
                    })

                    expect(wrapper.element.tagName).toBe('A')
                    expect(wrapper.classes()).toContain('btn')
                    expect(wrapper.classes()).toContain('btn-secondary')
                    expect(wrapper.classes()).not.toContain('disabled')
                    expect(wrapper.attributes('role')).toEqual('button')

                    wrapper.unmount()
                  })

            it('should emit click event when clicked', async() => {
                    let called = 0
                    let event = null
                    const wrapper = mount(BButton, {
                        attrs: {
                            onClick: e => {
                                event = e
                                called++
                            }
                        }
                    })

                    expect(wrapper.element.tagName).toBe('BUTTON')
                    expect(called).toBe(0)
                    expect(event).toEqual(null)
                    await wrapper.find('button').trigger('click')
                    expect(called).toBe(1)
                    expect(event).toBeInstanceOf(MouseEvent)

                    wrapper.unmount()
                })

                

    it('link with href="#" should treat keydown.space as click', async() => {
            let called = 0
            let event = null
            const wrapper = mount(BButton, {
                props: {
                    href: '#'
                },
                attrs: {
                    onClick: e => {
                        event = e
                        called++
                    }
                }
            })

            expect(wrapper.element.tagName).toBe('A')
            expect(wrapper.classes()).toContain('btn')
            expect(wrapper.classes()).toContain('btn-secondary')
            expect(wrapper.classes()).not.toContain('disabled')
            expect(wrapper.attributes('role')).toEqual('button')

            expect(called).toBe(0)
            expect(event).toEqual(null)

            // We add keydown.space to make links act like buttons
            await wrapper.find('.btn').trigger('keydown.space')
            expect(called).toBe(1)
            expect(event).toBeInstanceOf(Event)

            // Links treat keydown.enter natively as a click

            wrapper.unmount()
        })

            it('should not emit click event when clicked and disabled', async() => {
                let called = 0
                const wrapper = mount(BButton, {
                    props: {
                        disabled: true
                    },
                    attrs: {
                        onClick: () => {
                            called++
                        }
                    }
                })

                expect(wrapper.element.tagName).toBe('BUTTON')
                expect(called).toBe(0)
                await wrapper.find('button').trigger('click')
                expect(called).toBe(0)

                wrapper.unmount()
            })

            it('should not have `.active` class and `aria-pressed` when pressed is null', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        pressed: null
                    }
                })

                expect(wrapper.classes()).not.toContain('active')
                expect(wrapper.attributes('aria-pressed')).toBeUndefined()
                await wrapper.find('button').trigger('click')
                expect(wrapper.classes()).not.toContain('active')
                expect(wrapper.attributes('aria-pressed')).toBeUndefined()
                expect(wrapper.attributes('autocomplete')).toBeUndefined()

                wrapper.unmount()
            })

            it('should not have `.active` class and have `aria-pressed="false"` when pressed is false', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        pressed: false
                    }
                })

                expect(wrapper.classes()).not.toContain('active')
                expect(wrapper.attributes('aria-pressed')).toBeDefined()
                expect(wrapper.attributes('aria-pressed')).toBe('false')
                expect(wrapper.attributes('autocomplete')).toBeDefined()
                expect(wrapper.attributes('autocomplete')).toBe('off')

                wrapper.unmount()
            })

            it('should have `.active` class and have `aria-pressed="true"` when pressed is true', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        pressed: true
                    }
                })

                expect(wrapper.classes()).toContain('active')
                expect(wrapper.attributes('aria-pressed')).toBeDefined()
                expect(wrapper.attributes('aria-pressed')).toBe('true')
                expect(wrapper.attributes('autocomplete')).toBeDefined()
                expect(wrapper.attributes('autocomplete')).toBe('off')

                wrapper.unmount()
            })

            it('pressed should have `.focus` class when focused', async() => {
                const wrapper = mount(BButton, {
                    props: {
                        pressed: false
                    }
                })

                expect(wrapper.classes()).not.toContain('focus')
                await wrapper.trigger('focusin')
                expect(wrapper.classes()).toContain('focus')
                await wrapper.trigger('focusout')
                expect(wrapper.classes()).not.toContain('focus')

                wrapper.unmount()
            })

    it('should update the parent sync value on click and when pressed is not null', async() => {
            let called = 0
            const values = []
            const wrapper = mount(BButton, {
                props: {
                    pressed: false
                },
                attrs: {
                    'onUpdate:pressed': value => {
                      
                        values.push(value)
                        called++
                    }
                }
            })

            expect(called).toBe(0)

            await wrapper.find('button').trigger('click')

            expect(called).toBe(1)
            expect(values[0]).toBe(true)

            wrapper.unmount()
        })

            it('button has attribute aria-disabled when aria-disabled set', async() => {
                    const wrapper = mount(BButton, {
                        props: {
                            ariaDisabled: true
                        }
                    })

                    expect(wrapper.element.tagName).toBe('BUTTON')
                    expect(wrapper.attributes('type')).toBe('button')
                    expect(wrapper.classes()).toContain('btn')
                    expect(wrapper.classes()).toContain('btn-secondary')
                    expect(wrapper.classes()).toContain('disabled')
                    expect(wrapper.classes().length).toBe(3)
                    expect(wrapper.attributes('aria-disabled')).toBe('true')

                    wrapper.unmount()
                })

})