import SelectorEngine from "../dom/selector-engine.js";
import Manipulator from "../dom/manipulator.js";
import { isElement } from "./index.js";
const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
const SELECTOR_STICKY_CONTENT = ".sticky-top";
class ScrollBarHelper {
    _element;
    constructor() {
        this._element = document.body;
    }
    getWidth() {
        const documentWidth = document.documentElement.clientWidth;
        return Math.abs(window.innerWidth - documentWidth);
    }
    hide() {
        const width = this.getWidth();
        this._disableOverFlow();
        this._setElementAttributes(this._element, "paddingRight", (calculatedValue) => calculatedValue + width);
        this._setElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight", (calculatedValue) => calculatedValue + width);
        this._setElementAttributes(SELECTOR_STICKY_CONTENT, "marginRight", (calculatedValue) => calculatedValue - width);
    }
    _disableOverFlow() {
        this._saveInitialAttribute(this._element, "overflow");
        this._element.style.overflow = "hidden";
    }
    _setElementAttributes(selector, styleProp, callback) {
        const scrollbarWidth = this.getWidth();
        const manipulationCallBack = (element) => {
            if (element !== this._element &&
                window.innerWidth > element.clientWidth + scrollbarWidth) {
                return;
            }
            this._saveInitialAttribute(element, styleProp);
            const calculatedValue = window.getComputedStyle(element)[styleProp];
            element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
        };
        this._applyManipulationCallback(selector, manipulationCallBack);
    }
    reset() {
        this._resetElementAttributes(this._element, "overflow");
        this._resetElementAttributes(this._element, "paddingRight");
        this._resetElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight");
        this._resetElementAttributes(SELECTOR_STICKY_CONTENT, "marginRight");
    }
    _resetElementAttributes(selector, styleProp) {
        const manipulationCallBack = (element) => {
            const value = Manipulator.getDataAttribute(element, styleProp);
            if (typeof value === "undefined") {
                element.style.removeProperty(styleProp);
            }
            else {
                Manipulator.removeDataAttribute(element, styleProp);
                element.style[styleProp] = value;
            }
        };
        this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _applyManipulationCallback(selector, callBack) {
        if (isElement(selector)) {
            callBack(selector);
        }
        else {
            SelectorEngine.find(selector, this._element).forEach(callBack);
        }
    }
    _saveInitialAttribute(element, styleProp) {
        const actualValue = element.style[styleProp];
        if (actualValue && typeof styleProp == 'string') {
            Manipulator.setDataAttribute(element, styleProp, actualValue);
        }
    }
    isOverflowing() {
        return this.getWidth() > 0;
    }
}
export default ScrollBarHelper;
