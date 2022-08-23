import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_EMBED } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { arrayIncludes } from '../../utils/array'
import { omit } from '../../utils/object'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Constants ---

const TYPES = ['iframe', 'embed', 'video', 'object', 'img', 'b-img', 'b-img-lazy']

// --- Props ---

export const props = makePropsConfigurable({
        aspect: makeProp(PROP_TYPE_STRING, '16by9'),
        tag: makeProp(PROP_TYPE_STRING, 'div'),
        type: makeProp(PROP_TYPE_STRING, 'iframe', value => {
            return arrayIncludes(TYPES, value)
        })
    },
    NAME_EMBED
)

// --- Main component ---

// @vue/component
export const BEmbed = /*#__PURE__*/ defineComponent({
    name: NAME_EMBED,
    props,
    render(h, { props, data, children }) {
        const { aspect } = props

        return h(
            props.tag, {
                class: ['embed-responsive', {
                    [`embed-responsive-${aspect}`]: aspect }],
                ref: data.ref
            }, [
                h(
                    props.type,
                    mergeData(omit(data, ['ref']), { class: 'embed-responsive-item' }),
                    children
                )
            ]
        )
    }
})
