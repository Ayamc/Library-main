"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsSelect2 = void 0;
var observable_1 = require("./helper/observable");
var keys_1 = require("./keys");
var options_1 = require("./options");
var utils_1 = require("./utils/utils");
var listener_1 = require("./utils/event-listener/listener");
var insert_after_1 = require("./utils/insert-after");
var set_styles_1 = require("./utils/set-styles");
var get_element_size_1 = require("./utils/get-element-size");
var event_trigger_1 = require("./utils/event-trigger");
var element_from_string_1 = require("./utils/element-from-string");
var TsSelect2 = (function (_super) {
    __extends(TsSelect2, _super);
    function TsSelect2(element, options) {
        var _this = _super.call(this) || this;
        _this.listeners = [];
        if (utils_1.Utils.GetData(element, 'select2') != null) {
            utils_1.Utils.GetData(element, 'select2').destroy();
        }
        _this.element = element;
        _this.id = _this._generateId(element);
        options = options || {};
        _this.options = new options_1.Options(options, element);
        var tabindex = element.getAttribute('tabindex') || 0;
        utils_1.Utils.StoreData(element, 'old-tabindex', tabindex);
        element.setAttribute('tabindex', '-1');
        var DataAdapter = _this.options.get('dataAdapter');
        _this.dataAdapter = new DataAdapter(_this, _this.options);
        var container = _this.render();
        _this._placeContainer(container);
        var SelectionAdapter = _this.options.get('selectionAdapter');
        _this.selection = new SelectionAdapter(_this, _this.options);
        _this.selectionElement = _this.selection.render();
        _this.selection.position(_this.selectionElement, container);
        var DropdownAdapter = _this.options.get('dropdownAdapter');
        _this.dropdown = new DropdownAdapter(_this, _this.options);
        _this.dropdownElement = _this.dropdown.render();
        _this.dropdown.position(_this.dropdownElement, container);
        var ResultsAdapter = _this.options.get('resultsAdapter');
        _this.results = new ResultsAdapter(_this, _this.options, _this.dataAdapter);
        _this.resultsElement = _this.results.render();
        _this.results.position(_this.resultsElement, _this.dropdownElement);
        _this._bindAdapters();
        _this._registerDomEvents();
        _this._registerDataEvents();
        _this._registerSelectionEvents();
        _this._registerDropdownEvents();
        _this._registerResultsEvents();
        _this._registerEvents();
        _this.dataAdapter.current(function (initialData) {
            _this.trigger('selection:update', {
                data: initialData
            });
        });
        element.classList.add('select2-hidden-accessible');
        element.setAttribute('aria-hidden', 'true');
        _this._syncAttributes();
        utils_1.Utils.StoreData(element, 'select2', _this);
        return _this;
    }
    TsSelect2.prototype._generateId = function ($element) {
        var id = '';
        if ($element.getAttribute('id') != null) {
            id = $element.getAttribute('id');
        }
        else if ($element.getAttribute('name') != null) {
            id = $element.getAttribute('name') + '-' + utils_1.Utils.generateChars(2);
        }
        else {
            id = utils_1.Utils.generateChars(4);
        }
        id = id.replace(/(:|\.|\[|\]|,)/g, '');
        id = 'select2-' + id;
        return id;
    };
    TsSelect2.prototype._placeContainer = function ($container) {
        insert_after_1.insertAfter($container, this.element);
        var width = this._resolveWidth(this.element, this.options.get('width'));
        if (width != null) {
            set_styles_1.setStyles($container, { width: width });
        }
    };
    TsSelect2.prototype._resolveWidth = function ($element, method) {
        var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
        if (method === 'resolve') {
            var styleWidth = this._resolveWidth($element, 'style');
            if (styleWidth != null) {
                return styleWidth;
            }
            return this._resolveWidth($element, 'element');
        }
        if (method === 'element') {
            var elementWidth = get_element_size_1.getElementOuterWidth($element);
            if (elementWidth <= 0) {
                return 'auto';
            }
            return elementWidth + 'px';
        }
        if (method === 'style') {
            var style = $element.getAttribute('style');
            if (typeof (style) !== 'string') {
                return null;
            }
            var attrs = style.split(';');
            for (var i = 0, l = attrs.length; i < l; i = i + 1) {
                var attr = attrs[i].replace(/\s/g, '');
                var matches = attr.match(WIDTH);
                if (matches !== null && matches.length >= 1) {
                    return matches[1];
                }
            }
            return null;
        }
        if (method === 'computedstyle') {
            var computedStyle = window.getComputedStyle($element);
            return computedStyle.width;
        }
        return method;
    };
    TsSelect2.prototype._bindAdapters = function () {
        this.dataAdapter.binding(this, this.container);
        this.selection.binding(this, this.container);
        this.dropdown.binding(this, this.container);
        this.results.binding(this, this.container);
    };
    TsSelect2.prototype._registerDomEvents = function () {
        var _this = this;
        listener_1.createListener({
            elements: this.element,
            events: 'change',
            listeners: this.listeners,
            callback: function () {
                _this.dataAdapter.current(function (data) {
                    _this.trigger('selection:update', {
                        data: data
                    });
                });
            }
        });
        listener_1.createListener({
            elements: this.element,
            events: 'focus',
            listeners: this.listeners,
            callback: function (evt) {
                _this.trigger('focus', evt);
            }
        });
        this._syncA = utils_1.Utils.bind(this._syncAttributes, this);
        this._syncS = utils_1.Utils.bind(this._syncSubtree, this);
        this._observer = new MutationObserver(function (mutations) {
            _this._syncA();
            _this._syncS(mutations);
        });
        this._observer.observe(this.element, {
            attributes: true,
            childList: true,
            subtree: false
        });
    };
    TsSelect2.prototype._registerDataEvents = function () {
        var _this = this;
        this.dataAdapter.on('*', function (name, params) {
            _this.trigger(name, params);
        });
    };
    TsSelect2.prototype._registerSelectionEvents = function () {
        var _this = this;
        var nonRelayEvents = ['toggle', 'focus'];
        this.selection.on('toggle', function () {
            _this.toggleDropdown();
        });
        this.selection.on('focus', function (params) {
            _this.focus(params);
        });
        this.selection.on('*', function (name, params) {
            if (nonRelayEvents.indexOf(name) !== -1) {
                return;
            }
            _this.trigger(name, params);
        });
    };
    TsSelect2.prototype._registerDropdownEvents = function () {
        var _this = this;
        this.dropdown.on('*', function (name, params) {
            _this.trigger(name, params);
        });
    };
    TsSelect2.prototype._registerResultsEvents = function () {
        var _this = this;
        this.results.on('*', function (name, params) {
            _this.trigger(name, params);
        });
    };
    TsSelect2.prototype._registerEvents = function () {
        var _this = this;
        this.on('open', function () {
            _this.container.classList.add('select2-container--open');
        });
        this.on('close', function () {
            _this.container.classList.remove('select2-container--open');
        });
        this.on('enable', function () {
            _this.container.classList.remove('select2-container--disabled');
        });
        this.on('disable', function () {
            _this.container.classList.add('select2-container--disabled');
        });
        this.on('blur', function () {
            _this.container.classList.remove('select2-container--focus');
        });
        this.on('query', function (event) {
            if (!_this.isOpen()) {
                _this.trigger('open', {});
            }
            _this.dataAdapter.query(event, function (data) {
                _this.trigger('results:all', {
                    data: data,
                    query: event
                });
            });
        });
        this.on('query:append', function (event) {
            _this.dataAdapter.query(event, function (data) {
                _this.trigger('results:append', {
                    data: data,
                    query: event
                });
            });
        });
        this.on('keypress', function (evt) {
            var key = evt.which;
            if (_this.isOpen()) {
                if (key === keys_1.KEYS.ESC || key === keys_1.KEYS.TAB ||
                    (key === keys_1.KEYS.UP && evt.altKey)) {
                    _this.close(evt);
                    evt.preventDefault();
                }
                else if (key === keys_1.KEYS.ENTER) {
                    _this.trigger('results:select', {});
                    evt.preventDefault();
                }
                else if ((key === keys_1.KEYS.SPACE && evt.ctrlKey)) {
                    _this.trigger('results:toggle', {});
                    evt.preventDefault();
                }
                else if (key === keys_1.KEYS.UP) {
                    _this.trigger('results:previous', {});
                    evt.preventDefault();
                }
                else if (key === keys_1.KEYS.DOWN) {
                    _this.trigger('results:next', {});
                    evt.preventDefault();
                }
            }
            else {
                if (key === keys_1.KEYS.ENTER || key === keys_1.KEYS.SPACE ||
                    (key === keys_1.KEYS.DOWN && evt.altKey)) {
                    _this.open();
                    evt.preventDefault();
                }
            }
        });
    };
    TsSelect2.prototype._syncAttributes = function () {
        this.options.set('disabled', this.element.disabled);
        if (this.isDisabled()) {
            if (this.isOpen()) {
                this.close();
            }
            this.trigger('disable', {});
        }
        else {
            this.trigger('enable', {});
        }
    };
    TsSelect2.prototype._isChangeMutation = function (mutations) {
        var _this = this;
        if (mutations.addedNodes && mutations.addedNodes.length > 0) {
            for (var n = 0; n < mutations.addedNodes.length; n++) {
                var node = mutations.addedNodes[n];
                if (node.selected) {
                    return true;
                }
            }
        }
        else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
            return true;
        }
        else if (Array.isArray(mutations)) {
            return mutations.some(function (mutation) { return _this._isChangeMutation(mutation); });
        }
        return false;
    };
    TsSelect2.prototype._syncSubtree = function (mutations) {
        var _this = this;
        var changed = this._isChangeMutation(mutations);
        if (changed) {
            this.dataAdapter.current(function (currentData) {
                _this.trigger('selection:update', {
                    data: currentData
                });
            });
        }
    };
    TsSelect2.prototype.select2 = function (name) {
        switch (name) {
            case 'open':
                this.open();
                break;
            case 'close':
                this.close();
                break;
            case 'destroy':
                this.destroy();
                break;
        }
    };
    TsSelect2.prototype.trigger = function (name, args) {
        var actualTrigger = _super.prototype.trigger;
        var preTriggerMap = {
            'open': 'opening',
            'close': 'closing',
            'select': 'selecting',
            'unselect': 'unselecting',
            'clear': 'clearing'
        };
        if (args === undefined) {
            args = {};
        }
        if (name in preTriggerMap) {
            var preTriggerName = preTriggerMap[name];
            var preTriggerArgs = {
                prevented: false,
                name: name,
                args: args
            };
            actualTrigger.call(this, preTriggerName, preTriggerArgs);
            if (preTriggerArgs.prevented) {
                args.prevented = true;
                return;
            }
        }
        actualTrigger.call(this, name, args);
    };
    TsSelect2.prototype.toggleDropdown = function () {
        if (this.isDisabled()) {
            return;
        }
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    };
    TsSelect2.prototype.open = function () {
        if (this.isOpen()) {
            return;
        }
        if (this.isDisabled()) {
            return;
        }
        this.trigger('query', {});
    };
    TsSelect2.prototype.close = function (evt) {
        if (!this.isOpen()) {
            return;
        }
        this.trigger('close', { originalEvent: evt });
    };
    TsSelect2.prototype.isEnabled = function () {
        return !this.isDisabled();
    };
    TsSelect2.prototype.isDisabled = function () {
        return this.options.get('disabled');
    };
    TsSelect2.prototype.isOpen = function () {
        return this.container.classList.contains('select2-container--open');
    };
    TsSelect2.prototype.hasFocus = function () {
        return this.container.classList.contains('select2-container--focus');
    };
    TsSelect2.prototype.focus = function (data) {
        if (this.hasFocus()) {
            return;
        }
        this.container.classList.add('select2-container--focus');
        this.trigger('focus', {});
    };
    TsSelect2.prototype.enable = function (args) {
        if (this.options.get('debug') && window.console && console.warn) {
            console.warn('TsSelect2: The `select2("enable")` method has been deprecated and will' +
                ' be removed in later TsSelect2 versions. Use element.prop("disabled")' +
                ' instead.');
        }
        if (args == null || args.length === 0) {
            args = [true];
        }
        this.element.disabled = !args[0];
    };
    TsSelect2.prototype.data = function () {
        if (this.options.get('debug') &&
            arguments.length > 0 && window.console && console.warn) {
            console.warn('TsSelect2: Data can no longer be set using `select2("data")`. You ' +
                'should consider setting the value instead using `element.val()`.');
        }
        var data = [];
        this.dataAdapter.current(function (currentData) {
            data = currentData;
        });
        return data;
    };
    TsSelect2.prototype.val = function (args) {
        if (this.options.get('debug') && window.console && console.warn) {
            console.warn('TsSelect2: The `select2("val")` method has been deprecated and will be' +
                ' removed in later TsSelect2 versions. Use element.val() instead.');
        }
        if (args == null || args.length === 0) {
            return this.element.value;
        }
        var newVal = args[0];
        if (Array.isArray(newVal)) {
            newVal = newVal.map(function (obj) {
                return obj.toString();
            });
        }
        event_trigger_1.eventTrigger(this.element, 'input', newVal);
        event_trigger_1.eventTrigger(this.element, 'change', newVal);
    };
    TsSelect2.prototype.destroy = function () {
        this.container.remove();
        this._observer.disconnect();
        this._observer = null;
        this._syncA = null;
        this._syncS = null;
        listener_1.destroyListener(this.listeners);
        this.element.setAttribute('tabindex', utils_1.Utils.GetData(this.element, 'old-tabindex'));
        this.element.classList.remove('select2-hidden-accessible');
        this.element.setAttribute('aria-hidden', 'false');
        utils_1.Utils.RemoveData(this.element);
        delete this.element.dataset['select2'];
        this.dataAdapter.destroy();
        this.selection.destroy();
        this.dropdown.destroy();
        this.results.destroy();
        this.dataAdapter = null;
        this.selection = null;
        this.dropdown = null;
        this.results = null;
    };
    TsSelect2.prototype.render = function () {
        var container = element_from_string_1.elementFromString('<span class="select2 select2-container">' +
            '<span class="selection"></span>' +
            '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
            '</span>');
        container.setAttribute('dir', this.options.get('dir'));
        this.container = container;
        this.container.classList.add('select2-container--' + this.options.get('theme'));
        utils_1.Utils.StoreData(container, 'element', this);
        return container;
    };
    return TsSelect2;
}(observable_1.Observable));
exports.TsSelect2 = TsSelect2;
