import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_NAV_TEXT } from '../../constants/components'

// --- Props ---

export const props = {}

// --- Main component ---

// @vue/component
export const BNavText = /*#__PURE__*/ defineComponent({
    name: NAME_NAV_TEXT,
    functional: true,
    props,
    render(h, { data, children }) {
        return h('li', mergeData(data, { staticClass: 'navbar-text' }), children)
    }
})