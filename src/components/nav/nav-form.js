import { defineComponent } from 'vue'
import { mergeData } from 'vue-functional-data-merge'
import { NAME_NAV_FORM } from '../../constants/components'
import { PROP_TYPE_ARRAY_OBJECT_STRING } from '../../constants/props'
import { omit, sortKeys } from '../../utils/object'
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props'
import { BForm, props as BFormProps } from '../form/form'

// --- Props ---

const formProps = omit(BFormProps, ['inline'])

export const props = makePropsConfigurable(
    sortKeys({
        ...formProps,
        formClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING)
    }),
    NAME_NAV_FORM
)

// --- Main component ---

// @vue/component
export const BNavForm = /*#__PURE__*/ defineComponent({
    name: NAME_NAV_FORM,
    props,
    render(h, { props, data, children, listeners }) {
        const $form = h(
            BForm, {
                class: props.formClass,
                ...pluckProps(formProps, props),
                inline: true,
                ...(data.attrs ||{}),
                on: listeners
            },
            children
        )

        return h(
            'li',
            mergeData(omit(data, ['attrs', 'on']), {
                class: 'form-inline'
            }), [$form]
        )
    }
})