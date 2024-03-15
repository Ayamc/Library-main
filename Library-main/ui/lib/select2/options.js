"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
var defaults_1 = require("./defaults");
var utils_1 = require("./utils/utils");
var extend_1 = require("./utils/extend");
var is_plain_object_1 = require("./utils/is-plain-object");
var is_nil_1 = require("./utils/is-nil");
var Options = (function () {
    function Options(options, element) {
        this.options = options;
        this.defaults = new defaults_1.Defaults();
        if (!is_nil_1.isNil(element)) {
            this.fromElement(element);
            this.options = this.defaults.applyFromElement(this.options, element);
        }
        this.options = this.defaults.apply(__assign({}, options));
    }
    Options.prototype.fromElement = function (element) {
        var excludedData = ['select2'];
        if (this.options.multiple == null) {
            this.options.multiple = element.multiple;
        }
        if (this.options.disabled == null) {
            this.options.disabled = element.disabled;
        }
        if (this.options.autocomplete == null && element.autocomplete) {
            this.options.autocomplete = element.autocomplete;
        }
        if (this.options.dir == null) {
            if (element.dir) {
                this.options.dir = element.dir;
            }
            else if (!!element.closest('[dir]')) {
                this.options.dir = element.closest('[dir]')['dir'];
            }
            else {
                this.options.dir = 'ltr';
            }
        }
        element.disabled = this.options.disabled;
        element.multiple = this.options.multiple;
        if (utils_1.Utils.GetData(element, 'select2Tags')) {
            if (this.options.debug && window.console && console.warn) {
                console.warn('Select2: The `data-select2-tags` attribute has been changed to ' +
                    'use the `data-data` and `data-tags="true"` attributes and will be ' +
                    'removed in future versions of Select2.');
            }
            utils_1.Utils.StoreData(element, 'data', utils_1.Utils.GetData(element, 'select2Tags'));
            utils_1.Utils.StoreData(element, 'tags', true);
        }
        var dataset = {};
        function upperCaseLetter(_, letter) {
            return letter.toUpperCase();
        }
        for (var attr = 0; attr < element.attributes.length; attr++) {
            var attributeName = element.attributes[attr].name;
            var prefix = 'data-';
            if (attributeName.substr(0, prefix.length) === prefix) {
                var dataName = attributeName.substring(prefix.length);
                var dataValue = utils_1.Utils.GetData(element, dataName);
                var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);
                dataset[camelDataName] = dataValue;
            }
        }
        if (element.dataset) {
            dataset = extend_1.extend(true, {}, element.dataset, dataset);
        }
        var data = extend_1.extend(true, {}, utils_1.Utils.GetData(element), dataset);
        data = utils_1.Utils._convertData(data);
        for (var key in data) {
            if (excludedData.indexOf(key) > -1) {
                continue;
            }
            if (is_plain_object_1.isPlainObject(this.options[key])) {
                extend_1.extend(this.options[key], data[key]);
            }
            else {
                this.options[key] = data[key];
            }
        }
        return this;
    };
    Options.prototype.get = function (key) {
        return this.options[key];
    };
    Options.prototype.set = function (key, val) {
        this.options[key] = val;
    };
    return Options;
}());
exports.Options = Options;
