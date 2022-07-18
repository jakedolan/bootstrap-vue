import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_SKELETON_IMG } from '../../constants/components'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'
import { BAspect } from '../aspect'
import { BSkeleton } from './skeleton'

// --- Props ---

export const props = makePropsConfigurable({
        animation: makeProp(PROP_TYPE_STRING),
        aspect: makeProp(PROP_TYPE_STRING, '16:9'),
        cardImg: makeProp(PROP_TYPE_STRING),
        height: makeProp(PROP_TYPE_STRING),
        noAspect: makeProp(PROP_TYPE_BOOLEAN, false),
        variant: makeProp(PROP_TYPE_STRING),
        width: makeProp(PROP_TYPE_STRING)
    },
    NAME_SKELETON_IMG
)

// --- Main component ---

// @vue/component
export const BSkeletonImg = /*#__PURE__*/ defineComponent({
    name: NAME_SKELETON_IMG,
    props,
    render(h, { data, props }) {
        const { aspect, width, height, animation, variant, cardImg } = props

        const $img = h(
            BSkeleton,
            mergeData(data, {
                type: 'img',
                width,
                height,
                animation,
                variant,
                class: {
                    [`card-img-${cardImg}`]: cardImg }
            })
        )

        return props.noAspect ? $img : h(BAspect, { aspect }, [$img])
    }
})