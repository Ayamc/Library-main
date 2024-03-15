"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translation = void 0;
var extend_1 = require("./utils/extend");
var Translation = (function () {
    function Translation(dict) {
        this.dict = dict || {};
    }
    Translation.prototype.all = function () {
        return this.dict;
    };
    Translation.prototype.get = function (key) {
        return this.dict[key];
    };
    Translation.prototype.extend = function (translation) {
        this.dict = extend_1.extend({}, translation.all(), this.dict);
    };
    return Translation;
}());
exports.Translation = Translation;
