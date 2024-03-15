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
exports.Results = void 0;
var observable_1 = require("./helper/observable");
var utils_1 = require("./utils/utils");
var listener_1 = require("./utils/event-listener/listener");
var element_from_string_1 = require("./utils/element-from-string");
var event_trigger_1 = require("./utils/event-trigger");
var set_attributes_1 = require("./utils/set-attributes");
var get_element_offset_1 = require("./utils/get-element-offset");
var get_element_size_1 = require("./utils/get-element-size");
var Results = (function (_super) {
    __extends(Results, _super);
    function Results(element, options, dataAdapter) {
        var _this = _super.call(this) || this;
        _this.mouseenterListeners = [];
        _this.core = element;
        _this.data = dataAdapter;
        _this.options = options;
        return _this;
    }
    Results.prototype.render = function () {
        var results = element_from_string_1.elementFromString('<ul class="select2-results__options" role="listbox"></ul>');
        if (this.options.get('multiple')) {
            results.setAttribute('aria-multiselectable', 'true');
        }
        this.results = results;
        return results;
    };
    Results.prototype.clear = function () {
        utils_1.Utils.elementEmpty(this.results);
    };
    Results.prototype.displayMessage = function (params) {
        var escapeMarkup = this.options.get('escapeMarkup');
        this.clear();
        this.hideLoading();
        var messageElement = element_from_string_1.elementFromString('<li role="alert" aria-live="assertive" class="select2-results__option"></li>');
        var message = this.options.get('translations').get(params.message);
        messageElement.append(escapeMarkup(message(params.args)));
        messageElement.className += ' select2-results__message';
        this.results.append(messageElement);
    };
    Results.prototype.hideMessages = function () {
        var message = this.results.querySelector('.select2-results__message');
        if (message) {
            message.remove();
        }
    };
    Results.prototype.append = function (data) {
        var _this = this;
        this.hideLoading();
        var options = [];
        if (data.results == null || data.results.length === 0) {
            if (this.results.children.length === 0) {
                this.trigger('results:message', {
                    message: 'noResults'
                });
            }
            return;
        }
        data.results = this.sort(data.results);
        for (var d = 0; d < data.results.length; d++) {
            var item = data.results[d];
            var option = this.option(item);
            options.push(option);
        }
        options.forEach(function (option) {
            _this.results.appendChild(option);
        });
    };
    Results.prototype.position = function (results, dropdown) {
        var resultsContainer = dropdown.querySelector('.select2-results');
        resultsContainer.append(results);
    };
    Results.prototype.sort = function (data) {
        var sorter = this.options.get('sorter');
        return sorter(data);
    };
    Results.prototype.highlightFirstItem = function () {
        var options = this.results.querySelectorAll('.select2-results__option--selectable');
        var selected = Array.from(options).filter(function (opt) {
            return opt.classList.contains('select2-results__option--selected');
        });
        if (selected.length > 0) {
            event_trigger_1.eventTrigger(selected[0], 'mouseenter');
        }
        else if (options[0]) {
            event_trigger_1.eventTrigger(options[0], 'mouseenter');
        }
        this.ensureHighlightVisible();
    };
    Results.prototype.setClasses = function () {
        var _this = this;
        this.data.current(function (selected) {
            var selectedIds = selected.map(function (s) { return s.id.toString(); });
            var options = _this.results.querySelectorAll('.select2-results__option--selectable');
            options.forEach(function (option) {
                var item = utils_1.Utils.GetData(option, 'data');
                var id = '' + item.id;
                if ((item.element != null && item.element.selected) ||
                    (item.element == null && selectedIds.indexOf(id) > -1)) {
                    option.classList.add('select2-results__option--selected');
                    option.setAttribute('aria-selected', 'true');
                }
                else {
                    option.classList.remove('select2-results__option--selected');
                    option.setAttribute('aria-selected', 'false');
                }
            });
        });
    };
    Results.prototype.showLoading = function (params) {
        this.hideLoading();
        var loadingMore = this.options.get('translations').get('searching');
        var loading = {
            disabled: true,
            loading: true,
            text: loadingMore(params)
        };
        var loadingElement = this.option(loading);
        loadingElement.className += ' loading-results';
        this.results.prepend(loadingElement);
    };
    Results.prototype.hideLoading = function () {
        var loading = this.results.querySelector('.loading-results');
        if (loading) {
            loading.remove();
        }
    };
    Results.prototype.option = function (data) {
        var option = document.createElement('li');
        option.classList.add('select2-results__option');
        option.classList.add('select2-results__option--selectable');
        var attrs = {
            'role': 'option'
        };
        var matches = Element.prototype.matches ||
            Element.prototype['msMatchesSelector'] ||
            Element.prototype.webkitMatchesSelector;
        if ((data.element != null && matches.call(data.element, ':disabled')) ||
            (data.element == null && data.disabled)) {
            attrs['aria-disabled'] = 'true';
            option.classList.remove('select2-results__option--selectable');
            option.classList.add('select2-results__option--disabled');
        }
        if (data.id == null) {
            option.classList.remove('select2-results__option--selectable');
        }
        if (data._resultId != null) {
            option.id = data._resultId;
        }
        if (data.title) {
            option.title = data.title;
        }
        if (data.children) {
            attrs.role = 'group';
            attrs['aria-label'] = data.text;
            option.classList.remove('select2-results__option--selectable');
            option.classList.add('select2-results__option--group');
        }
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                var val = attrs[attr];
                option.setAttribute(attr, val);
            }
        }
        if (data.children) {
            var label = document.createElement('strong');
            label.className = 'select2-results__group';
            this.template(data, label);
            var children = [];
            for (var c = 0; c < data.children.length; c++) {
                var child = data.children[c];
                var $child = this.option(child);
                children.push($child);
            }
            var childrenContainer = element_from_string_1.elementFromString('<ul></ul>');
            set_attributes_1.setAttributes(childrenContainer, {
                'class': 'select2-results__options select2-results__options--nested',
                'role': 'none'
            });
            childrenContainer.append.apply(childrenContainer, children);
            option.append(label);
            option.append(childrenContainer);
        }
        else {
            this.template(data, option);
        }
        utils_1.Utils.StoreData(option, 'data', data);
        return option;
    };
    Results.prototype.binding = function (select, container) {
        var _this = this;
        var id = select.id + '-results';
        this.results.setAttribute('id', id);
        select.on('results:all', function (params) {
            _this.clear();
            _this.append(params.data);
            if (select.isOpen()) {
                _this.setClasses();
                _this.highlightFirstItem();
            }
        });
        select.on('results:append', function (params) {
            _this.append(params.data);
            if (select.isOpen()) {
                _this.setClasses();
            }
        });
        select.on('query', function (params) {
            _this.hideMessages();
            _this.showLoading(params);
        });
        select.on('select', function () {
            if (!select.isOpen()) {
                return;
            }
            _this.setClasses();
            if (_this.options.get('scrollAfterSelect')) {
                _this.highlightFirstItem();
            }
        });
        select.on('unselect', function () {
            if (!select.isOpen()) {
                return;
            }
            _this.setClasses();
            if (_this.options.get('scrollAfterSelect')) {
                _this.highlightFirstItem();
            }
        });
        select.on('open', function () {
            _this.results.setAttribute('aria-expanded', 'true');
            _this.results.setAttribute('aria-hidden', 'false');
            _this.setClasses();
            _this.ensureHighlightVisible();
        });
        select.on('close', function () {
            _this.results.setAttribute('aria-expanded', 'false');
            _this.results.setAttribute('aria-hidden', 'true');
            _this.results.removeAttribute('aria-activedescendant');
        });
        select.on('results:toggle', function () {
            var highlighted = _this.getHighlightedResults();
            if (highlighted.length === 0) {
                return;
            }
            highlighted.forEach(function (element) { return event_trigger_1.eventTrigger(element, 'mouseup'); });
        });
        select.on('results:select', function () {
            var highlighted = _this.getHighlightedResults();
            if (highlighted.length === 0) {
                return;
            }
            var data = utils_1.Utils.GetData(highlighted[0], 'data');
            if (highlighted[0].classList.contains('select2-results__option--selected')) {
                _this.trigger('close', {});
            }
            else {
                _this.trigger('select', {
                    data: data
                });
            }
        });
        select.on('results:previous', function () {
            var highlighted = _this.getHighlightedResults();
            var options = _this.results.querySelectorAll('.select2-results__option--selectable');
            var currentIndex = [].indexOf.call(options, highlighted);
            if (currentIndex <= 0) {
                return;
            }
            var nextIndex = currentIndex - 1;
            if (!highlighted) {
                nextIndex = 0;
            }
            var $next = options[nextIndex];
            event_trigger_1.eventTrigger($next, 'mouseenter');
            var currentOffset = get_element_offset_1.getElementOffset(_this.results).top;
            var nextTop = get_element_offset_1.getElementOffset($next).top;
            var nextOffset = _this.results.scrollTop + (nextTop - currentOffset);
            if (nextIndex === 0) {
                _this.results.scrollTop = 0;
            }
            else if (nextTop - currentOffset < 0) {
                _this.results.scrollTop = nextOffset;
            }
        });
        select.on('results:next', function () {
            var highlighted = _this.getHighlightedResults();
            var options = _this.results.querySelectorAll('.select2-results__option--selectable');
            var currentIndex = [].indexOf.call(options, highlighted);
            var nextIndex = currentIndex + 1;
            if (nextIndex >= options.length) {
                return;
            }
            var $next = options[nextIndex];
            event_trigger_1.eventTrigger($next, 'mouseenter');
            var currentOffset = get_element_offset_1.getElementOffset(_this.results).top + get_element_size_1.getElementOuterHeight(_this.results);
            var nextBottom = get_element_offset_1.getElementOffset($next).top + get_element_size_1.getElementOuterHeight($next);
            var nextOffset = _this.results.scrollTop + nextBottom - currentOffset;
            if (nextIndex === 0) {
                _this.results.scrollTop = 0;
            }
            else if (nextBottom > currentOffset) {
                _this.results.scrollTop = nextOffset;
            }
        });
        select.on('results:focus', function (params) {
            params.element.classList.add('select2-results__option--highlighted');
            params.element.setAttribute('aria-selected', 'true');
        });
        select.on('results:message', function (params) {
            _this.displayMessage(params);
        });
        var getSelectables = function () {
            return _this.results.querySelectorAll('.select2-results__option--selectable');
        };
        listener_1.createListener({
            elements: this.results,
            events: 'mouseup',
            listeners: this.core.listeners,
            callback: function (originalEvent) {
                var element = originalEvent.target.closest('.select2-results__option--selectable');
                if (!element) {
                    return;
                }
                var data = utils_1.Utils.GetData(element, 'data');
                if (element.classList.contains('select2-results__option--selected')) {
                    if (_this.options.get('multiple')) {
                        _this.trigger('unselect', { originalEvent: originalEvent, data: data });
                    }
                    else {
                        _this.trigger('close', {});
                    }
                    return;
                }
                _this.trigger('select', { originalEvent: originalEvent, data: data });
            }
        });
        listener_1.createListener({
            elements: this.results,
            events: 'mouseenter',
            listeners: this.core.listeners,
            callback: function () {
                listener_1.destroyListener(_this.mouseenterListeners);
                listener_1.createListener({
                    elements: getSelectables(),
                    events: 'mouseenter',
                    listeners: _this.mouseenterListeners,
                    callback: function (originalEvent) {
                        var element = originalEvent.target;
                        _this.getHighlightedResults().forEach(function (element) {
                            element.classList.remove('select2-results__option--highlighted');
                            element.setAttribute('aria-selected', 'false');
                        });
                        var data = utils_1.Utils.GetData(element, 'data');
                        _this.trigger('results:focus', { data: data, element: element });
                    }
                });
            }
        });
    };
    Results.prototype.getHighlightedResults = function () {
        return this.results.querySelectorAll('.select2-results__option--highlighted');
    };
    Results.prototype.destroy = function () {
        this.results.remove();
        listener_1.destroyListener(this.mouseenterListeners);
    };
    Results.prototype.ensureHighlightVisible = function () {
        var highlighted = this.getHighlightedResults();
        if (highlighted.length === 0) {
            return;
        }
        var options = this.results.querySelectorAll('.select2-results__option--selectable');
        var currentIndex = [].indexOf.call(options, highlighted);
        var currentOffset = get_element_offset_1.getElementOffset(this.results).top;
        var nextTop = get_element_offset_1.getElementOffset(highlighted[0]).top;
        var nextOffset = this.results.scrollTop + (nextTop - currentOffset);
        var offsetDelta = nextTop - currentOffset;
        nextOffset -= get_element_size_1.getElementOuterHeight(highlighted[0]) * 2;
        if (currentIndex <= 2) {
            this.results.scrollTop = 0;
        }
        else if (offsetDelta > get_element_size_1.getElementOuterHeight(this.results) || offsetDelta < 0) {
            this.results.scrollTop = nextOffset;
        }
    };
    Results.prototype.template = function (result, container) {
        var template = this.options.get('templateResult');
        var escapeMarkup = this.options.get('escapeMarkup');
        var content = template(result, container);
        if (content == null) {
            container.style.display = 'none';
        }
        else if (typeof content === 'string') {
            container.innerHTML = escapeMarkup(content);
        }
        else {
            container.append(content);
        }
    };
    return Results;
}(observable_1.Observable));
exports.Results = Results;
