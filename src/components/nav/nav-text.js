import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_NAV_TEXT } from '../../constants/components'

// --- Props ---

export const props = {}

// --- Main component ---

// @vue/component
export const BNavText = /*#__PURE__*/ defineComponent({
    name: NAME_NAV_TEXT,
    props,
    render() {
        const { $data: data, $slots: slots } = this;
        return h('li', mergeData(data, { class: 'navbar-text' }), slots)
    }
})
