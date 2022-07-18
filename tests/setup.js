import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'


// app.config.compilerOptions.whitespace = 'condense'
// // VTU.mount(document.createElement('div'))

// Don't stub `<transition>` and `<transition-group>` components
config.global.stubs.transition = false
config.global.stubs['transition-group'] = false