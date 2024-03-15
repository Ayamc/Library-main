import Data from "./dom/data.js";
import { executeAfterTransition, getElement } from "./utils/index.js";
import EventHandler from "./dom/event-handler.js";
const VERSION = "1";
class BaseComponent {
    _element = null;
    constructor(element, _ = null) {
        const resolvedElement = getElement(element);
        if (!resolvedElement) {
            return;
        }
        this._element = resolvedElement;
        if (!this._element) {
            console.error("Element is null");
            return;
        }
        Data.setData(this._element, this.constructor.DATA_KEY, this);
    }
    dispose() {
        if (this._element) {
            Data.removeData(this._element, this.constructor.DATA_KEY);
            EventHandler.off(this._element, this.constructor.EVENT_KEY);
            Object.getOwnPropertyNames(this).forEach((propertyName) => {
                this[propertyName] = null;
            });
            this._element = null;
        }
    }
    _queueCallback(callback, element, isAnimated = true) {
        executeAfterTransition(callback, element, isAnimated);
    }
    static getInstance(element) {
        return Data.getData(getElement(element), this.DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
    static get VERSION() {
        return VERSION;
    }
    static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!');
    }
    static get DATA_KEY() {
        return `te.${this.NAME}`;
    }
    static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
    }
}
export default BaseComponent;
