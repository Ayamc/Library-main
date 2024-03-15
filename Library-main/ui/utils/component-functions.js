import EventHandler from "../dom/event-handler.js";
import { getElementFromSelector, isDisabled } from "./index.js";
let addedEventsList = [];
const enableDismissTrigger = (component, method = "hide") => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    if (addedEventsList.includes(name)) {
        return;
    }
    addedEventsList.push(name);
    EventHandler.on(document, clickEvent, `[data-${name}-dismiss]`, function (event) {
        const refThis = this;
        if (["A", "AREA"].includes(refThis.tagName)) {
            event.preventDefault();
        }
        if (isDisabled(refThis)) {
            return;
        }
        const target = getElementFromSelector(refThis) ||
            refThis.closest(`.${name}`) ||
            refThis.closest(`[data-${name}-init]`);
        if (!target) {
            return;
        }
        const instance = component.getOrCreateInstance && component.getOrCreateInstance(target);
        if (typeof instance[method] == 'function') {
            instance[method]();
        }
        ;
    });
};
export { enableDismissTrigger };
