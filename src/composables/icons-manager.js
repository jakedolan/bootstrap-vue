import { resolveComponent } from 'vue';
import { isString } from '../utils/inspect';

// outside the composable for sharing instances.
const components = [];

export function useIconsManager() {

    function findOrRegister(iconName, component = null) {
        return isRegistered(iconName) ? getComponent(iconName) : registerComponent(iconName, component);
    }

    function getComponent(iconName) {
        const i = components.map((comp) => comp.name).findIndex((name) => name === iconName);
        return i !== -1 ? components[i].component : null;
    }

    function getIconsList() {
        return components.map((comp) => comp.name);
    }

    function isRegistered(iconName) {
        const i = components.map((comp) => comp.name).findIndex((name) => name === iconName);
        return i !== -1;
    }

    function registerComponent(iconName, component = null) {
        if (!component) {
            // If not found, resolveComponent throws console warning. resolveDynamicComponent does not, but appears to be undocumented so may be Vue internal api function.
            const icon = resolveComponent(iconName);
            components.push({ name: iconName, component: icon });
            return !isString(icon) ? icon : null;
        } else {
            components.push({ name: iconName, component: component });
            return component;
        }
    }


    return {
        findOrRegister,
        getIconsList
    }
}