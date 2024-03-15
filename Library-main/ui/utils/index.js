const MILLISECONDS_MULTIPLIER = 1000;
export const SELECTOR_NO_JQUERY = "data-no-jquery";
const TRANSITION_END = "transitionend";
const MAX_UID = 1000000;
const getJQuery = () => {
    const { jQuery } = window;
    if (jQuery && !document.body.hasAttribute(SELECTOR_NO_JQUERY)) {
        return jQuery;
    }
    return null;
};
const isElement = (obj) => {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (typeof obj.jquery !== "undefined") {
        obj = obj[0];
    }
    return typeof obj.nodeType !== "undefined";
};
function getElement(obj) {
    if (isElement(obj)) {
        return obj.jquery ? obj[0] : obj;
    }
    if (typeof obj === "string" && obj.length > 0) {
        return document.querySelector(obj);
    }
    return null;
}
const reflow = (element) => {
    element.offsetHeight;
};
const noop = () => function () { };
const toType = (obj) => {
    if (obj === null || obj === undefined) {
        return `${obj}`;
    }
    const o = {};
    return o?.toString
        ?.call(obj)
        ?.match(/\s([a-z]+)/i)[1]
        ?.toLowerCase();
};
function triggerTransitionEnd(element) {
    element.dispatchEvent(new Event(TRANSITION_END));
}
const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach((property) => {
        const expectedTypes = configTypes[property];
        const value = config[property];
        const valueType = value && isElement(value) ? "element" : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        }
    });
};
const isVisible = (element) => {
    if (!element || element.getClientRects().length === 0) {
        return false;
    }
    const valid = Object.hasOwnProperty.call(element, "style") &&
        Object.hasOwnProperty.call(element, "parentNode") &&
        Object.hasOwnProperty.call(element.parentNode, "style");
    if (!valid) {
        return false;
    }
    const elementStyle = getComputedStyle(element);
    const parentNodeStyle = getComputedStyle(element.parentNode);
    return (getComputedStyle(element).getPropertyValue("visibility") === "visible" ||
        (elementStyle.display !== "none" &&
            parentNodeStyle.display !== "none" &&
            elementStyle.visibility !== "hidden"));
};
const isDisabled = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }
    if (element.classList.contains("disabled")) {
        return true;
    }
    if (typeof element?.disabled !== "undefined") {
        return element.disabled;
    }
    return (element.getAttribute("disabled") !== null ||
        element.getAttribute("aria-disabled") !== "false");
};
const DOMContentLoadedCallbacks = [];
const onDOMContentLoaded = (callback) => {
    if (document.readyState === "loading") {
        if (!DOMContentLoadedCallbacks.length) {
            document.addEventListener("DOMContentLoaded", () => {
                DOMContentLoadedCallbacks.forEach((cb) => cb());
            });
        }
        DOMContentLoadedCallbacks.push(callback);
    }
    else {
        callback();
    }
};
function executeAfterTransition(callback, transitionElement, waitForTransition = true) {
    if (!waitForTransition) {
        callback();
        return;
    }
    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;
    const handler = ({ target }) => {
        if (target !== transitionElement) {
            return;
        }
        called = true;
        transitionElement.removeEventListener(TRANSITION_END, handler);
        callback();
    };
    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
        if (!called) {
            triggerTransitionEnd(transitionElement);
        }
    }, emulatedDuration);
}
function slug(str) {
    return str
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}
function getTransitionDurationFromElement(element) {
    if (!element) {
        return 0;
    }
    const { transitionDuration, transitionDelay } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);
    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
    }
    const firstTransitionDuration = transitionDuration.split(",")[0];
    const firstTransitionDelay = transitionDelay.split(",")[0];
    return ((Number.parseFloat(firstTransitionDuration) +
        Number.parseFloat(firstTransitionDelay)) *
        MILLISECONDS_MULTIPLIER);
}
const getSelector = (element) => {
    let selector = element.getAttribute("data-te-target");
    if (!selector || selector === "#") {
        let hrefAttr = element.getAttribute("href");
        if (!hrefAttr || (!hrefAttr.includes("#") && !hrefAttr.startsWith("."))) {
            return null;
        }
        if (hrefAttr.includes("#") && !hrefAttr.startsWith("#")) {
            hrefAttr = `#${hrefAttr.split("#")[1]}`;
        }
        selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : null;
    }
    return selector;
};
const getElementFromSelector = (element) => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
};
const isRTL = () => document.documentElement.dir === "rtl";
const getUID = (prefix) => {
    do {
        prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));
    return prefix;
};
const findShadowRoot = (element) => {
    if (!document.documentElement.attachShadow) {
        return null;
    }
    if (typeof element.getRootNode === "function") {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
    }
    if (element instanceof ShadowRoot) {
        return element;
    }
    if (!element.parentNode) {
        return null;
    }
    return findShadowRoot(element.parentNode);
};
export { getJQuery, typeCheckConfig, isVisible, isDisabled, findShadowRoot, getElement, isElement, getTransitionDurationFromElement, onDOMContentLoaded, getElementFromSelector, executeAfterTransition, slug, reflow, noop, isRTL, getUID, };
