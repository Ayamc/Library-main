import SelectorEngine from "../dom/selector-engine.js";
import InitRegister from "./Register.js";
const register = new InitRegister();
const defaultOptions = {
    allowReInits: false,
    checkOtherImports: false,
};
const defaultInitSelectors = {
    Rating: {
        name: "rating",
        selector: "[data-rating-init]",
        isToggler: false,
    },
    CountDown: {
        name: "count_down",
        selector: "[data-count_down-init]",
        isToggler: false
    },
    Pagination: {
        name: "pagination",
        selector: "[data-pagination-init]",
        isToggler: false
    },
    Toast: {
        name: "toast",
        selector: "[data-toast-init]",
        isToggler: false
    }
};
const getComponentData = (component) => {
    const config = Object.values(defaultInitSelectors).find((element) => {
        return element.name === component.NAME;
    });
    return config || null;
};
const initComponent = (component, options) => {
    if (!component ||
        (!options.allowReInits && register.isInited(component.NAME))) {
        return;
    }
    register.add(component.NAME);
    const thisComponent = getComponentData(component);
    const isToggler = thisComponent?.isToggler || false;
    if (thisComponent?.advanced) {
        thisComponent.advanced(component, thisComponent?.selector);
        return;
    }
    if (isToggler) {
        thisComponent?.callback &&
            thisComponent?.callback(component, thisComponent?.selector);
    }
    if (!thisComponent?.selector) {
        return;
    }
    SelectorEngine.find(thisComponent?.selector).forEach((element) => {
        let instance = component.getInstance(element);
        if (!instance) {
            instance = new component(element);
            if (thisComponent?.onInit) {
                instance[thisComponent.onInit]();
            }
        }
    });
};
const init = (components, options) => {
    return components.forEach((component) => {
        return initComponent(component, options);
    });
};
const initLib = (components, options = {}) => {
    options = {
        ...defaultOptions,
        ...options,
    };
    const componentsKeys = Object.keys(defaultInitSelectors);
    const componentList = componentsKeys.map((element) => {
        const comp = defaultInitSelectors[element];
        const requireAutoInit = Boolean(document.querySelector(comp.selector));
        if (requireAutoInit) {
            const component = components[element];
            if (!component &&
                !register.isInited(element) &&
                options.checkOtherImports) {
                console.warn(`Component ${comp.name} is not initialized`);
            }
            return component;
        }
        else {
            return null;
        }
    });
    const filteredComponents = componentList.filter((element) => !!element);
    init(filteredComponents, options);
};
export default initLib;
