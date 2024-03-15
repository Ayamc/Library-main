import { reflow, typeCheckConfig } from '../utils/index.js';
import EventHandler from '../dom/event-handler.js';
import Manipulator from '../dom/manipulator.js';
import BaseComponent from '../base-component.js';
import { enableDismissTrigger } from '../utils/component-functions.js';
const NAME = 'toast';
const DATA_KEY = `cc.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const HIDE_DATA_ATTRIBUTE = 'data-toast-hide';
const SHOW_DATA_ATTRIBUTE = 'data-toast-show';
const SHOWING_DATA_ATTRIBUTE = 'data-toast-showing';
const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
};
const Default = {
    animation: true,
    autohide: true,
    delay: 5000
};
const DefaultClassesType = {
    fadeIn: 'string',
    fadeOut: 'string',
};
const DefaultClasses = {
    fadeIn: 'cc-animate-fade-in',
    fadeOut: 'cc-animate-fade-out',
};
export default class Toast extends BaseComponent {
    _config;
    _classes;
    _timeout;
    _hasMouseInteraction;
    _hasKeyboardInteraction;
    _didInit;
    constructor(element, config, classes) {
        super(element);
        this._config = this._getConfig(config);
        this._classes = this._getClasses(classes);
        this._timeout = null;
        this._hasMouseInteraction = false;
        this._hasKeyboardInteraction = false;
        this._setListeners();
        this._didInit = false;
        this._init();
    }
    static get NAME() {
        return NAME;
    }
    static get Default() {
        return Default;
    }
    static get DefaultType() {
        return DefaultType;
    }
    _init() {
        if (this._didInit)
            return;
        enableDismissTrigger(Toast);
        this._didInit = true;
    }
    _maybeScheduleHide() {
        if (!this._config.autohide)
            return;
        if (this._hasMouseInteraction || this._hasKeyboardInteraction)
            return;
        this._timeout = setTimeout(() => {
            this.hide();
        }, this._config.delay);
    }
    _onInteraction(event, isInteracting) {
        switch (event.type) {
            case 'mouseover':
            case 'mouseout':
                this._hasMouseInteraction = isInteracting;
                break;
            case 'focusin':
                this._hasKeyboardInteraction = isInteracting;
                break;
            default:
                break;
        }
        if (isInteracting) {
            this._clearTimeout();
            return;
        }
        if (!this._element)
            return;
        const nextElement = event['relatedTarget'];
        if (this._element.contains(nextElement))
            return;
        this._maybeScheduleHide();
    }
    _setListeners() {
        EventHandler.on(this._element, EVENT_MOUSEOVER, (event) => {
            this._onInteraction(event, true);
        });
        EventHandler.on(this._element, EVENT_MOUSEOUT, (event) => {
            this._onInteraction(event, false);
        });
        EventHandler.on(this._element, EVENT_FOCUSIN, (event) => {
            this._onInteraction(event, true);
        });
        EventHandler.on(this._element, EVENT_FOCUSOUT, (event) => {
            this._onInteraction(event, false);
        });
    }
    _getConfig(config) {
        if (!this._element)
            return {
                ...Default,
                ...config
            };
        config = {
            ...Default,
            ...Manipulator.getDataAttributes(this._element),
            ...config
        };
        typeCheckConfig(NAME, config, DefaultType);
        return config;
    }
    _getClasses(classes = {}) {
        if (!this._element)
            return {
                ...DefaultClasses,
                ...classes
            };
        const dataAttributes = Manipulator.getDataAttributes(this._element);
        classes = {
            ...DefaultClasses,
            ...dataAttributes,
            ...classes
        };
        typeCheckConfig(NAME, classes, DefaultClassesType);
        return classes;
    }
    hide() {
        if (!this._element || Manipulator.getDataAttribute(this._element, SHOW_DATA_ATTRIBUTE) === undefined)
            return;
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
        if (!hideEvent) {
            throw new Error('Hide event must return a boolean value');
        }
        if (hideEvent.defaultPrevented)
            return;
        const complete = () => {
            if (!this._element)
                return;
            let timeout = 0;
            if (this._config.animation) {
                timeout = 300;
                Manipulator.removeClass(this._element, this._classes.fadeIn);
                Manipulator.addClass(this._element, this._classes.fadeOut);
            }
            setTimeout(() => {
                if (!this._element)
                    return;
                this._element.setAttribute(HIDE_DATA_ATTRIBUTE, '');
                this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
                this._element.removeAttribute(SHOWING_DATA_ATTRIBUTE);
                EventHandler.trigger(this._element, EVENT_HIDDEN);
            }, timeout);
        };
        this._element.setAttribute(HIDE_DATA_ATTRIBUTE, '');
        this._queueCallback(complete, this._element, this._config.animation);
    }
    show() {
        if (!this._element)
            return;
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
        if (!showEvent) {
            throw new Error('Show event must return a boolean value');
        }
        if (showEvent.defaultPrevented)
            return;
        this._clearTimeout();
        if (this._config.animation) {
            Manipulator.removeClass(this._element, this._classes.fadeOut);
            Manipulator.addClass(this._element, this._classes.fadeIn);
        }
        const complete = () => {
            if (!this._element)
                return;
            this._element.removeAttribute(SHOWING_DATA_ATTRIBUTE);
            EventHandler.trigger(this._element, EVENT_SHOWN);
            this._maybeScheduleHide();
        };
        this._element.removeAttribute(HIDE_DATA_ATTRIBUTE);
        reflow(this._element);
        this._element.setAttribute(SHOW_DATA_ATTRIBUTE, '');
        this._element.setAttribute(SHOWING_DATA_ATTRIBUTE, '');
        this._queueCallback(complete, this._element, this._config.animation);
    }
    dispose() {
        this._clearTimeout();
        if (!this._element)
            return;
        if (this._element.dataset.toastShow !== undefined) {
            this._element.removeAttribute('data-toast-show');
        }
        super.dispose();
    }
    _clearTimeout() {
        if (!this._timeout)
            return;
        clearTimeout(this._timeout);
        this._timeout = null;
    }
}
