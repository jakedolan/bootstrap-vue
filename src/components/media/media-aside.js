import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_MEDIA_ASIDE } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        right: makeProp(PROP_TYPE_BOOLEAN, false),
        tag: makeProp(PROP_TYPE_STRING, 'div'),
        verticalAlign: makeProp(PROP_TYPE_STRING, 'top')
    },
    NAME_MEDIA_ASIDE
)

// --- Main component ---

// @vue/component
export const BMediaAside = /*#__PURE__*/ defineComponent({
    name: NAME_MEDIA_ASIDE,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        const { verticalAlign } = props
        const align =
            verticalAlign === 'top' ?
            'start' :
            verticalAlign === 'bottom' ?
            'end' :
            /* istanbul ignore next */
            verticalAlign

        return h(
            props.tag,
            mergeData(data, {
                class: ['media-aside', {
                    'media-aside-right': props.right,
                    [`align-self-${align}`]: align
                }]
            }),
            slots
        )
    }
})
