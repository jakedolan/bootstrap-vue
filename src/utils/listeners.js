import { isString } from './inspect.js'
import { pascalCase } from './string.js'

export function eventToListener(name) {
    return isString(name) ? `on${pascalCase(name)}` : null;
}
