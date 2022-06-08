import { HAS_WINDOW_SUPPORT } from '../constants/env'
import { setConfig } from './config-set'

/**
 * Plugin install factory function.
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */
export const installFactory = ({ components, directives, plugins } = {}) => {
  const install = (app, config = {}) => {
    if (install.installed) {
      /* istanbul ignore next */
      return
    }
    install.installed = true
    setConfig(app, config)
    registerComponents(app, components)
    registerDirectives(app, directives)
    registerPlugins(app, plugins)
  }

  install.installed = false

  return install
}

/**
 * Plugin install factory function (no plugin config option).
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */
export const installFactoryNoConfig = ({ components, directives, plugins } = {}) => {
  const install = Vue => {
    if (install.installed) {
      /* istanbul ignore next */
      return
    }
    install.installed = true
    registerComponents(Vue, components)
    registerDirectives(Vue, directives)
    registerPlugins(Vue, plugins)
  }

  install.installed = false

  return install
}

/**
 * Plugin object factory function.
 * @param {object} { components, directives, plugins }
 * @returns {object} plugin install object
 */
export const pluginFactory = (options = {}, extend = {}) => ({
  ...extend,
  install: installFactory(options)
})

/**
 * Plugin object factory function (no config option).
 * @param {object} { components, directives, plugins }
 * @returns {object} plugin install object
 */
export const pluginFactoryNoConfig = (options = {}, extend = {}) => ({
  ...extend,
  install: installFactoryNoConfig(options)
})

/**
 * Load a group of plugins.
 * @param {object} Vue
 * @param {object} Plugin definitions
 */
export const registerPlugins = (Vue, plugins = {}) => {
  for (const plugin in plugins) {
    if (plugin && plugins[plugin]) {
      Vue.use(plugins[plugin])
    }
  }
}

/**
 * Load a component.
 * @param {object} Vue
 * @param {string} Component name
 * @param {object} Component definition
 */
export const registerComponent = (Vue, name, def) => {
  if (Vue && name && def) {
    Vue.component(name, def)
  }
}

/**
 * Load a group of components.
 * @param {object} Vue
 * @param {object} Object of component definitions
 */
export const registerComponents = (Vue, components = {}) => {
  for (const component in components) {
    registerComponent(Vue, component, components[component])
  }
}

/**
 * Load a directive.
 * @param {object} Vue
 * @param {string} Directive name
 * @param {object} Directive definition
 */
export const registerDirective = (Vue, name, def) => {
  if (Vue && name && def) {
    // Ensure that any leading V is removed from the
    // name, as Vue adds it automatically
    Vue.directive(name.replace(/^VB/, 'B'), def)
  }
}

/**
 * Load a group of directives.
 * @param {object} Vue
 * @param {object} Object of directive definitions
 */
export const registerDirectives = (Vue, directives = {}) => {
  for (const directive in directives) {
    registerDirective(Vue, directive, directives[directive])
  }
}

/**
 * Install plugin if window.Vue available
 * @param {object} Plugin definition
 */
export const vueUse = VuePlugin => {
  /* istanbul ignore next */
  if (HAS_WINDOW_SUPPORT && window.Vue) {
    window.Vue.use(VuePlugin)
  }
  /* istanbul ignore next */
  if (HAS_WINDOW_SUPPORT && VuePlugin.NAME) {
    window[VuePlugin.NAME] = VuePlugin
  }
}
