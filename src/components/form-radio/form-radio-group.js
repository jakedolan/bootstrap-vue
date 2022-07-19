import { defineComponent } from 'vue'
import { NAME_FORM_RADIO_GROUP } from '../../constants/components'
import { EVENT_NAME_CHANGE } from '../../constants/events'
import { makePropsConfigurable } from '../../utils/props'
import {
    MODEL_EVENT_NAME,
    formRadioCheckGroupMixin,
    props as formRadioCheckGroupProps
} from '../../mixins/form-radio-check-group'

// --- Props ---

export const props = makePropsConfigurable(formRadioCheckGroupProps, NAME_FORM_RADIO_GROUP)

// --- Main component ---

// @vue/component
export const BFormRadioGroup = /*#__PURE__*/ defineComponent({
    name: NAME_FORM_RADIO_GROUP,
    mixins: [formRadioCheckGroupMixin],
    provide() {
        return {
            getBvRadioGroup: () => this
        }
    },
    emits: [EVENT_NAME_CHANGE, MODEL_EVENT_NAME],
    props,
    computed: {
        isRadioGroup() {
            return true
        }
    }
})