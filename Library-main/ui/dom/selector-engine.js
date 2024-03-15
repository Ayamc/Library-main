const SelectorEngine = {
    closest(element, selector) {
        return element.closest(selector);
    },
    matches(element, selector) {
        return element.matches(selector);
    },
    find(selector, element = document.documentElement) {
        return Array.from(element.querySelectorAll(selector));
    },
    findOne(selector, element = document.documentElement) {
        return element.querySelector(selector);
    },
    children(element, selector) {
        const children = Array.from(element.children);
        return children.filter((child) => child.matches(selector));
    },
    parents(element, selector) {
        const parents = [];
        let ancestor = element.parentElement;
        while (!!ancestor && ancestor.nodeType === Node.ELEMENT_NODE) {
            if (this.matches(ancestor, selector)) {
                parents.push(ancestor);
            }
            ancestor = ancestor.parentElement;
        }
        return parents;
    },
    firstParent(element) {
        let ancestor = element.parentElement;
        while (!!ancestor && ancestor.nodeType === Node.ELEMENT_NODE) {
            return ancestor;
        }
        return null;
    },
    prev(element, selector) {
        let previous = element.previousElementSibling;
        while (previous) {
            if (previous.matches(selector)) {
                return [previous];
            }
            previous = previous.previousElementSibling;
        }
        return [];
    },
    next(element, selector) {
        let next = element.nextElementSibling;
        while (next) {
            if (!!next && this.matches(next, selector)) {
                return [next];
            }
            next = next.nextElementSibling;
        }
        return [];
    },
    focusableChildren(element) {
        const focusables = [
            "a",
            "button",
            "input",
            "textarea",
            "select",
            "details",
            "[tabindex]",
            '[contenteditable="true"]',
        ]
            .map((selector) => `${selector}:not([tabindex^="-"])`)
            .join(", ");
        return this.find(focusables, element).filter((el) => !isDisabled(el) && isVisible(el));
    },
};
export default SelectorEngine;
function isDisabled(el) {
    const disabledAttr = el.getAttribute("disabled");
    return disabledAttr !== null;
}
function isVisible(el) {
    const style = window.getComputedStyle(el);
    return style.display !== "none";
}
