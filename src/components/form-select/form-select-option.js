import { defineComponent, h } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_FORM_SELECT_OPTION } from '../../constants/components'
import { PROP_TYPE_ANY, PROP_TYPE_BOOLEAN } from '../../constants/props'
import { makeProp, makePropsConfigurable } from '../../utils/props'

// --- Props ---

export const props = makePropsConfigurable({
        disabled: makeProp(PROP_TYPE_BOOLEAN, false),
        value: makeProp(PROP_TYPE_ANY, undefined, true) // Required
    },
    NAME_FORM_SELECT_OPTION
)

// --- Main component ---

// @vue/component
export const BFormSelectOption = /*#__PURE__*/ defineComponent({
    name: NAME_FORM_SELECT_OPTION,
    props,
    render() {
        const { $props: props, $data: data, $slots: slots } = this;
        const { value, disabled } = props
        return h(
            'option',
            mergeData(data, {
                disabled,
                value
            }),
            slots
        )
    }
})
