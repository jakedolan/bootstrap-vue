import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_MEDIA_BODY } from '../../constants/components'
import { PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        tag: makeProp(PROP_TYPE_STRING, 'div')
    },
    NAME_MEDIA_BODY
)

// --- Main component ---

// @vue/component
export const BMediaBody = /*#__PURE__*/ defineComponent({
    name: NAME_MEDIA_BODY,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        return h(props.tag, mergeData(data, { class: 'media-body' }), slots)
    }
})
