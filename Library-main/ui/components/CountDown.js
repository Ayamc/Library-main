import { typeCheckConfig } from "../utils/index.js";
import Data from '../dom/data.js';
import SelectorEngine from "../dom/selector-engine.js";
import Manipulator from "../dom/manipulator.js";
const NAME = 'count_down';
const DATA_KEY = "cc.countDown";
const SELECTOR = {
    years: '[data-year]',
    months: '[data-month]',
    days: '[data-day]',
    hours: '[data-hour]',
    minutes: '[data-minute]',
    seconds: '[data-second]',
};
const DefaultType = {
    targetDate: 'string',
    interval: 'number',
};
const Default = {
    interval: 1000,
    targetDate: '2021-01-01 00:00:00',
};
class CountDown {
    _element = null;
    _intervalId = null;
    _dateDownElements = {};
    _targetTime;
    _remainingTime = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };
    _config;
    constructor(element, config) {
        this._element = element;
        this._config = this._getConfig(config);
        this._targetTime = new Date(this._config.targetDate);
        this._dateDownElements = {
            years: SelectorEngine.findOne(SELECTOR['years'], this._element),
            months: SelectorEngine.findOne(SELECTOR['months'], this._element),
            days: SelectorEngine.findOne(SELECTOR['days'], this._element),
            hours: SelectorEngine.findOne(SELECTOR['hours'], this._element),
            minutes: SelectorEngine.findOne(SELECTOR['minutes'], this._element),
            seconds: SelectorEngine.findOne(SELECTOR['seconds'], this._element),
        };
        if (this._element) {
            Data.setData(this._element, DATA_KEY, this);
            this._init();
        }
    }
    static get NAME() {
        return NAME;
    }
    dispose() {
        if (!this._element)
            return;
        Data.removeData(this._element, DATA_KEY);
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._element = null;
    }
    _init() {
        if (!this._element)
            return;
        const now = new Date();
        if (now > this._targetTime) {
            this._removeTimer();
        }
        this._startCountDown();
    }
    _getConfig(config) {
        if (!this._element)
            throw new Error('Element is not defined');
        const dataAttributes = Manipulator.getDataAttributes(this._element);
        config = {
            ...Default,
            ...dataAttributes,
            ...config,
        };
        typeCheckConfig(NAME, config, DefaultType);
        if (config === null) {
            throw new Error('No config provided');
        }
        return config;
    }
    _startCountDown() {
        this._calculateRemainingTime();
        this._updateDisplay();
        this._intervalId = window.setInterval(() => {
            this._calculateRemainingTime();
            this._updateDisplay();
            if (this._remainingTime.hours <= 0 && this._remainingTime.minutes <= 0 && this._remainingTime.seconds <= 0 && this._remainingTime.days <= 0 && this._remainingTime.months <= 0 && this._remainingTime.years <= 0) {
                this._intervalId && clearInterval(this._intervalId);
            }
        }, Number(this._config.interval));
    }
    _calculateRemainingTime() {
        const now = new Date();
        const diff = this._targetTime.getTime() - now.getTime();
        if (diff <= 0) {
            this._removeTimer();
            return;
        }
        const targetDate = new Date(this._targetTime);
        const currentDate = new Date();
        let yearsDiff = targetDate.getFullYear() - currentDate.getFullYear();
        let monthsDiff = targetDate.getMonth() - currentDate.getMonth();
        let daysDiff = targetDate.getDate() - currentDate.getDate();
        if (monthsDiff < 0) {
            yearsDiff--;
            monthsDiff += 12;
        }
        if (daysDiff < 0) {
            monthsDiff--;
            daysDiff = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() - currentDate.getDate() + targetDate.getDate();
        }
        this._remainingTime.years = yearsDiff;
        this._remainingTime.months = monthsDiff;
        this._remainingTime.days = daysDiff;
        let remainingSeconds = Math.floor(diff / 1000);
        this._remainingTime.hours = Math.floor(remainingSeconds / 3600);
        remainingSeconds = remainingSeconds % 3600;
        this._remainingTime.minutes = Math.floor(remainingSeconds / 60);
        this._remainingTime.seconds = remainingSeconds % 60;
    }
    _removeTimer() {
        if (!this._element)
            return;
        this._remainingTime = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            days: 0,
            months: 0,
            years: 0
        };
        this.setValueDate('years', '0000');
        this.setValueDate('months', '00');
        this.setValueDate('days', '00');
        this.setValueDate('hours', '00');
        this.setValueDate('minutes', '00');
        this.setValueDate('seconds', '00');
    }
    _updateDisplay() {
        if (!this._element)
            return;
        this.setValueDate('years', this._remainingTime.years.toString());
        this.setValueDate('months', this._remainingTime.months.toString());
        this.setValueDate('days', this._remainingTime.days.toString());
        this.setValueDate('hours', this._remainingTime.hours.toString());
        this.setValueDate('minutes', this._remainingTime.minutes.toString());
        this.setValueDate('seconds', this._remainingTime.seconds.toString());
    }
    setValueDate(att, value) {
        if (!this._element)
            return;
        const element = this._dateDownElements[att];
        if (!element)
            return;
        element.innerHTML = value;
    }
    static getInstance(element) {
        return Data.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config) {
        return (this.getInstance(element) ||
            new this(element, typeof config === 'object' ? config : null));
    }
}
export default CountDown;
