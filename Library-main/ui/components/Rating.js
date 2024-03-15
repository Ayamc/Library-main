import { typeCheckConfig } from "../utils/index.js";
import Data from "../dom/data.js";
import EventHandler from "../dom/event-handler.js";
import SelectorEngine from "../dom/selector-engine.js";
import Manipulator from "../dom/manipulator.js";
const NAME = "rating";
const DATA_KEY = "cc.rating";
const SELECTOR_ICON = "[data-rating-icon-ref]";
const EVENT_KEY = `.${DATA_KEY}`;
const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";
const EVENT_SELECT = `onSelect${EVENT_KEY}`;
const EVENT_HOVER = `onHover${EVENT_KEY}`;
const EVENT_KEYUP = `keyup${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;
const DefaultType = {
    tooltip: "string",
    value: "(string|number)",
    readonly: "boolean",
    after: "string",
    before: "string",
    dynamic: "boolean",
    active: "string",
};
const Default = {
    tooltip: "top",
    value: "",
    readonly: false,
    after: "",
    before: "",
    dynamic: false,
    active: "fill-current",
};
class Rating {
    _element;
    _icons;
    _options;
    _index;
    _savedIndex;
    _originalClassList;
    _originalIcons;
    _fn;
    constructor(element, options) {
        this._element = element;
        this._icons = SelectorEngine.find(SELECTOR_ICON, this._element);
        this._options = this._getConfig(options);
        this._index = -1;
        this._savedIndex = null;
        this._originalClassList = [];
        this._originalIcons = [];
        this._fn = {};
        if (this._element) {
            Data.setData(element, DATA_KEY, this);
            this._init();
        }
    }
    static get NAME() {
        return NAME;
    }
    dispose() {
        if (!this._element) {
            return;
        }
        Data.removeData(this._element, DATA_KEY);
        if (!this._options.readonly) {
            EventHandler.off(this._element, EVENT_KEYUP);
            EventHandler.off(this._element, EVENT_FOCUSOUT);
            EventHandler.off(this._element, EVENT_KEYDOWN);
            this._element.removeEventListener('mouseleave', this._fn.mouseleave);
            this._icons.forEach((el, i) => {
                EventHandler.off(el, EVENT_MOUSEDOWN);
                el.removeEventListener('mouseenter', this._fn.mouseenter[i]);
                Manipulator.removeClass(el, 'cursor-pointer');
            });
            this._icons.forEach((el) => el.removeAttribute('tabIndex'));
        }
        this._element = null;
    }
    _init() {
        if (!this._options.readonly) {
            this._bindMouseEnter();
            this._bindMouseLeave();
            this._bindMouseDown();
            this._bindKeyDown();
            this._bindKeyUp();
            this._bindFocusLost();
            this._icons.forEach((icon) => {
                Manipulator.addClass(icon, "cursor-pointer");
            });
        }
        if (this._options.dynamic) {
            this._saveOriginalClassList();
            this._saveOriginalIcons();
        }
        this._setCustomText();
        this._setToolTips();
        if (this._options.value) {
            const value = Number(this._options.value) - 1;
            this._index = value;
            this._updateRating();
        }
    }
    _getConfig(config) {
        if (!this._element)
            throw new Error("No element found");
        const dataAttributes = Manipulator.getDataAttributes(this._element);
        config = {
            ...Default,
            ...dataAttributes,
            ...config,
        };
        typeCheckConfig(NAME, config, DefaultType);
        if (config === null) {
            throw new Error(`No config for "${NAME}"`);
        }
        return config;
    }
    _bindMouseEnter() {
        this._fn.mouseenter = [];
        this._icons.forEach((el, i) => {
            el.addEventListener("mouseenter", (this._fn.mouseenter[i] = (event) => {
                this._index = this._icons.indexOf(event.target);
                this._updateRating(this._index);
                this._triggerEvents(el, EVENT_HOVER);
            }));
        });
    }
    _bindMouseLeave() {
        if (!this._element)
            return;
        this._element.addEventListener("mouseleave", (this._fn.mouseleave = () => {
            if (this._savedIndex !== null) {
                this._updateRating(this._savedIndex);
                this._index = this._savedIndex;
            }
            else if (this._options.value) {
                const value = Number(this._options.value) - 1;
                this._updateRating(value);
                this._index = value;
            }
            else {
                this._index = -1;
                this._clearRating();
            }
        }));
    }
    _bindMouseDown() {
        this._icons.forEach((el) => {
            EventHandler.on(el, EVENT_MOUSEDOWN, () => {
                this._setElementOutline("none");
                this._savedIndex = this._index;
                this._triggerEvents(el, EVENT_SELECT);
            });
        });
    }
    _bindKeyDown() {
        if (!this._element)
            return;
        this._element.tabIndex = 0;
        EventHandler.on(this._element, EVENT_KEYDOWN, (e) => {
            this._updateAfterKeyDown(e);
        });
    }
    _bindKeyUp() {
        EventHandler.on(this._element, EVENT_KEYUP, () => {
            this._setElementOutline("auto");
        });
    }
    _bindFocusLost() {
        EventHandler.on(this._element, EVENT_FOCUSOUT, () => {
            this._setElementOutline("none");
        });
    }
    _updateRating(index = this._index) {
        this._clearRating();
        if (this._options.dynamic) {
            this._restoreOriginalIcon(index);
        }
        this._icons.forEach((el, i) => {
            if (i <= index) {
                const svgElement = el.querySelector("svg");
                if (!svgElement) {
                    console.error("No SVG element found in rating icon");
                    return;
                }
                Manipulator.addClass(svgElement, this._options.active);
            }
        });
    }
    _clearRating() {
        this._icons.forEach((el, i) => {
            const element = el.querySelector("svg");
            if (!element) {
                console.error("No SVG element found in rating icon");
                return;
            }
            if (this._options.dynamic) {
                el.classList.add(this._originalClassList[i]);
                element.innerHTML = this._originalIcons[i].innerHTML || "";
            }
            Manipulator.removeClass(element, this._options.active);
        });
    }
    _setElementOutline(value) {
        if (!this._element)
            return;
        this._element.style.outline = value;
    }
    _updateAfterKeyDown(e) {
        const maxIndex = this._icons.length - 1;
        const indexBeforeChange = this._index;
        if (e.key == ARROW_RIGHT_KEY && this._index < maxIndex) {
            this._index++;
        }
        if (e.key == ARROW_LEFT_KEY && this._index > 0) {
            this._index--;
        }
        if (indexBeforeChange !== this._index) {
            this._savedIndex = this._index;
            this._updateRating(this._savedIndex);
            this._triggerEvents(this._icons[this._savedIndex], EVENT_SELECT);
        }
    }
    _restoreOriginalIcon(index) {
        const classList = this._originalClassList[index];
        const icon = this._originalIcons[index];
        this._icons.forEach((el, i) => {
            if (i <= index) {
                const element = el.querySelector("svg");
                if (!element) {
                    console.error("No SVG element found in rating icon");
                    return;
                }
                element.innerHTML = icon.innerHTML || "";
                el.classList.remove(classList);
            }
        });
    }
    _saveOriginalClassList() {
        this._icons.forEach((el) => {
            const classList = el.classList.value;
            this._originalClassList.push(classList);
        });
    }
    _saveOriginalIcons() {
        this._icons.forEach((el) => {
            const classList = el.classList.value;
            this._originalClassList.push(classList);
        });
    }
    _triggerEvents(el, event) {
        EventHandler.trigger(el, event, {
            value: this._index + 1,
        });
    }
    _setToolTips() {
        this._icons.forEach((el, _) => {
            const hasOwnTooltips = Manipulator.getDataAttribute(el, "tooltip");
            if (el.title && !hasOwnTooltips) {
                Manipulator.setDataAttribute(el, "toggle", "tooltip");
            }
        });
    }
    _setCustomText() {
        this._icons.forEach((el) => {
            const after = Manipulator.getDataAttribute(el, "after");
            const before = Manipulator.getDataAttribute(el, "before");
            if (after) {
                el.insertAdjacentHTML("afterend", String(after));
            }
            if (before) {
                el.insertAdjacentHTML("beforebegin", String(before));
            }
        });
    }
    static getInstance(element) {
        return Data.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
}
export default Rating;
