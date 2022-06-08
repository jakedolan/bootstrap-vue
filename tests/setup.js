import '@testing-library/jest-dom'
import { configureCompat, createApp, h } from 'vue'
import VueRouter from 'vue-router'
import * as VTU from '@vue/test-utils'
import { installCompat as installVTUCompat, fullCompatConfig } from 'vue-test-utils-compat'


    configureCompat({
        MODE: 3,
        // required by Vue-router
        CONFIG_OPTION_MERGE_STRATS: 'suppress-warning',
        GLOBAL_PRIVATE_UTIL: 'suppress-warning',
        GLOBAL_PROTOTYPE: 'suppress-warning',

        // required due to global mixin on vue-router
        INSTANCE_EVENT_HOOKS: 'suppress-warning',
        OPTIONS_DESTROYED: 'suppress-warning',
        INSTANCE_EVENT_EMITTER: 'suppress-warning',

        // required by portal-vue
        GLOBAL_SET: 'suppress-warning',

        // globals
        GLOBAL_EXTEND: 'suppress-warning',
        GLOBAL_MOUNT: 'suppress-warning'
    })

    const app = createApp({
      compatConfig: {
          MODE: 3,
          RENDER_FUNCTION: 'suppress-warning'
      },
      render() {
          compatH = h
      }
  });

    app.use(VueRouter)

    app.component('RouterLink').compatConfig = {
        MODE: 2,
        RENDER_FUNCTION: 'suppress-warning',
        INSTANCE_SCOPED_SLOTS: 'suppress-warning'
    }

    app.component('RouterView').compatConfig = {
        MODE: 2,
        RENDER_FUNCTION: 'suppress-warning',
        COMPONENT_FUNCTIONAL: 'suppress-warning'
    }

    let compatH
    app.config.compilerOptions.whitespace = 'condense'
    .mount(document.createElement('div'))
    installVTUCompat(VTU, fullCompatConfig, compatH)
}

// Don't stub `<transition>` and `<transition-group>` components
VTU.config.stubs.transition = false
VTU.config.stubs['transition-group'] = false