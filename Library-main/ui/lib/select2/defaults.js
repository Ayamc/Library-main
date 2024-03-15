"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Defaults = void 0;
var array_1 = require("./adapters/array");
var maximum_input_length_1 = require("./adapters/extensions/maximum-input-length");
var maximum_selection_length_1 = require("./adapters/extensions/maximum-selection-length");
var minimum_input_length_1 = require("./adapters/extensions/minimum-input-length");
var tags_1 = require("./adapters/extensions/tags");
var tokenizer_1 = require("./adapters/extensions/tokenizer");
var select_1 = require("./adapters/select");
var diacritics_1 = require("./diacritics");
var dropdown_1 = require("./dropdown/dropdown");
var attach_body_1 = require("./dropdown/extensions/attach-body");
var close_on_select_1 = require("./dropdown/extensions/close-on-select");
var dropdown_css_1 = require("./dropdown/extensions/dropdown-css");
var hide_placeholder_1 = require("./dropdown/extensions/hide-placeholder");
var infinite_scroll_1 = require("./dropdown/extensions/infinite-scroll");
var minimum_results_for_search_1 = require("./dropdown/extensions/minimum-results-for-search");
var search_1 = require("./dropdown/extensions/search");
var select_on_close_1 = require("./dropdown/extensions/select-on-close");
var en_1 = require("./i18n/en");
var ru_1 = require("./i18n/ru");
var results_1 = require("./results");
var allow_clear_1 = require("./selection/extensions/allow-clear");
var event_relay_1 = require("./selection/extensions/event-relay");
var placeholder_1 = require("./selection/extensions/placeholder");
var search_2 = require("./selection/extensions/search");
var selection_css_1 = require("./selection/extensions/selection-css");
var multiple_1 = require("./selection/multiple");
var single_1 = require("./selection/single");
var translation_1 = require("./translation");
var utils_1 = require("./utils/utils");
var extend_1 = require("./utils/extend");
var is_nil_1 = require("./utils/is-nil");
var escape_html_1 = require("./utils/escape-html");
var camel_case_1 = require("./utils/camel-case");
var ajax_1 = require("./adapters/ajax");
var Defaults = (function () {
    function Defaults() {
        this.reset();
    }
    Defaults.prototype.apply = function (options) {
        options = extend_1.extend(true, {}, this.defaults, options);
        if (is_nil_1.isNil(options.dataAdapter)) {
            if (!is_nil_1.isNil(options.ajax)) {
                options.dataAdapter = ajax_1.AjaxAdapter;
            }
            else if (!is_nil_1.isNil(options.data)) {
                options.dataAdapter = array_1.ArrayAdapter;
            }
            else {
                options.dataAdapter = select_1.SelectAdapter;
            }
            if (options.minimumInputLength > 0) {
                options.dataAdapter = minimum_input_length_1.MinimumInputLength(options.dataAdapter);
            }
            if (options.maximumInputLength > 0) {
                options.dataAdapter = maximum_input_length_1.MaximumInputLength(options.dataAdapter);
            }
            if (options.maximumSelectionLength > 0) {
                options.dataAdapter = maximum_selection_length_1.MaximumSelectionLength(options.dataAdapter);
            }
            if (options.tags) {
                options.dataAdapter = tags_1.Tags(options.dataAdapter);
            }
            if (options.tokenSeparators != null || options.tokenizer != null) {
                options.dataAdapter = tokenizer_1.Tokenizer(options.dataAdapter);
            }
        }
        if (is_nil_1.isNil(options.resultsAdapter)) {
            options.resultsAdapter = results_1.Results;
            if (!is_nil_1.isNil(options.ajax)) {
                options.resultsAdapter = infinite_scroll_1.InfiniteScroll(options.resultsAdapter);
            }
            if (!is_nil_1.isNil(options.infiniteScroll)) {
                options.resultsAdapter = infinite_scroll_1.InfiniteScroll(options.resultsAdapter);
            }
            if (!is_nil_1.isNil(options.placeholder)) {
                options.resultsAdapter = hide_placeholder_1.HidePlaceholder(options.resultsAdapter);
            }
            if (options.selectOnClose) {
                options.resultsAdapter = select_on_close_1.SelectOnClose(options.resultsAdapter);
            }
        }
        if (is_nil_1.isNil(options.dropdownAdapter)) {
            options.dropdownAdapter = dropdown_1.Dropdown;
            if (!options.multiple) {
                options.dropdownAdapter = search_1.DropdownSearch(options.dropdownAdapter);
            }
            if (options.minimumResultsForSearch !== 0) {
                options.dropdownAdapter = minimum_results_for_search_1.MinimumResultsForSearch(options.dropdownAdapter);
            }
            if (options.closeOnSelect) {
                options.dropdownAdapter = close_on_select_1.CloseOnSelect(options.dropdownAdapter);
            }
            if (!is_nil_1.isNil(options.dropdownCssClass)) {
                options.dropdownAdapter = dropdown_css_1.DropdownCss(options.dropdownAdapter);
            }
            options.dropdownAdapter = attach_body_1.AttachBody(options.dropdownAdapter);
        }
        if (is_nil_1.isNil(options.selectionAdapter)) {
            if (options.multiple) {
                options.selectionAdapter = multiple_1.MultipleSelection;
            }
            else {
                options.selectionAdapter = single_1.SingleSelection;
            }
            if (!is_nil_1.isNil(options.placeholder)) {
                options.selectionAdapter = placeholder_1.Placeholder(options.selectionAdapter);
            }
            if (options.allowClear) {
                options.selectionAdapter = allow_clear_1.AllowClear(options.selectionAdapter);
            }
            if (options.multiple) {
                options.selectionAdapter = search_2.SelectionSearch(options.selectionAdapter);
            }
            if (!is_nil_1.isNil(options.selectionCssClass)) {
                options.selectionAdapter = selection_css_1.SelectionCss(options.selectionAdapter);
            }
            options.selectionAdapter = event_relay_1.EventRelay(options.selectionAdapter);
        }
        options.language = this._resolveLanguage(options.language, options.debug);
        options.translations = this._processTranslations(options.language);
        return options;
    };
    Defaults.prototype.reset = function () {
        function stripDiacritics(text) {
            function match(a) {
                return diacritics_1.DIACRITICS[a] || a;
            }
            return text.replace(/[^\u0000-\u007E]/g, match);
        }
        function matcher(params, data) {
            if (params.term == null || params.term.trim() === '') {
                return data;
            }
            if (data.children && data.children.length > 0) {
                var match = extend_1.extend(true, {}, data);
                for (var c = data.children.length - 1; c >= 0; c--) {
                    var child = data.children[c];
                    var matches = matcher(params, child);
                    if (matches == null) {
                        match.children.splice(c, 1);
                    }
                }
                if (match.children.length > 0) {
                    return match;
                }
                return matcher(params, match);
            }
            var original = stripDiacritics(data.text).toUpperCase();
            var term = stripDiacritics(params.term).toUpperCase();
            if (original.indexOf(term) > -1) {
                return data;
            }
            return null;
        }
        this.defaults = {
            amdLanguageBase: './i18n/',
            autocomplete: 'off',
            closeOnSelect: true,
            debug: false,
            dropdownAutoWidth: false,
            escapeMarkup: escape_html_1.escapeHTML,
            language: {},
            matcher: matcher,
            minimumInputLength: 0,
            maximumInputLength: 0,
            maximumSelectionLength: 0,
            minimumResultsForSearch: 0,
            selectOnClose: false,
            scrollAfterSelect: false,
            sorter: function (data) { return data; },
            templateResult: function (result) { return result.text; },
            templateSelection: function (selection) { return selection.text; },
            theme: 'default',
            width: 'resolve'
        };
    };
    Defaults.prototype.applyFromElement = function (options, element) {
        var optionLanguage = options.language;
        var defaultLanguage = this.defaults.language;
        var elementLanguage = element.lang;
        var parentLanguage = element.closest('[lang]').lang;
        options.language = parentLanguage || elementLanguage || defaultLanguage || optionLanguage;
        return options;
    };
    Defaults.prototype._resolveLanguage = function (language, debug) {
        if (!language) {
            return en_1.EnTranslations;
        }
        switch (language) {
            case 'ru':
                return ru_1.RuTranslations;
            case 'en':
                return en_1.EnTranslations;
            default:
                if (debug && window.console && console.warn) {
                    console.warn('TsSelect2: The language file for "' + language + '" could ' +
                        'not be automatically loaded. A fallback will be used instead.');
                }
                return en_1.EnTranslations;
        }
    };
    Defaults.prototype._processTranslations = function (language) {
        var translations = new translation_1.Translation();
        var languageData = new translation_1.Translation(language);
        translations.extend(languageData);
        return translations;
    };
    Defaults.prototype.set = function (key, value) {
        var camelKey = camel_case_1.camelCase(key);
        var data = {};
        data[camelKey] = value;
        var convertedData = utils_1.Utils._convertData(data);
        extend_1.extend(true, this.defaults, convertedData);
    };
    return Defaults;
}());
exports.Defaults = Defaults;
