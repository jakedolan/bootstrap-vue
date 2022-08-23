import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_BREADCRUMB } from '../../constants/components'
import { PROP_TYPE_ARRAY } from '../../constants/props'
import { isArray, isObject } from '../../utils/inspect'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { toString } from '../../utils/string'
import { BBreadcrumbItem } from './breadcrumb-item'

// --- Props ---

export const props = makePropsConfigurable({
        items: makeProp(PROP_TYPE_ARRAY)
    },
    NAME_BREADCRUMB
)

// --- Main component ---

// @vue/component
export const BBreadcrumb = /*#__PURE__*/ defineComponent({
    name: NAME_BREADCRUMB,
    props,
    render(h, { props, data, children }) {
        const { items } = props

        // Build child nodes from items, if given
        let childNodes = children
        if (isArray(items)) {
            let activeDefined = false
            childNodes = items.map((item, idx) => {
                if (!isObject(item)) {
                    item = { text: toString(item) }
                }
                // Copy the value here so we can normalize it
                let { active } = item
                if (active) {
                    activeDefined = true
                }
                // Auto-detect active by position in list
                if (!active && !activeDefined) {
                    active = idx + 1 === items.length
                }

                return h(BBreadcrumbItem, {...(item || {}), active })
            })
        }

        return h('ol', mergeData(data, { class: 'breadcrumb' }), childNodes)
    }
})
