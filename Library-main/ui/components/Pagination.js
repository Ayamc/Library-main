import { typeCheckConfig } from "../utils/index.js";
import Data from "../dom/data.js";
import EventHandler from "../dom/event-handler.js";
import SelectorEngine from "../dom/selector-engine.js";
import Manipulator from "../dom/manipulator.js";
import { updateURLParameter, getParam } from "./Toggle.js";
const Name = 'pagination';
const DATA_KEY = 'cc.pagination';
const DATA_PAGINATION_ATTRIBUTE = 'data-pagination-page';
const SELECTOR_PREV = '[data-pagination-prev]';
const SELECTOR_NEXT = '[data-pagination-next]';
const SELECTOR_PAGE = `[${DATA_PAGINATION_ATTRIBUTE}]`;
const SELECTOR_DOTS = '[data-pagination-dots]';
const DATA_PAGINATION_GALLERY_KEY = 'pagination-item-page';
const DefaultType = {
    currentPage: 'number',
    pageSize: 'number',
    totalItems: 'number',
    maxPageSize: 'number',
    numberOfPagesToShow: 'number',
    key: 'string'
};
const Default = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    maxPageSize: 100,
    numberOfPagesToShow: 5,
    key: 'pagination'
};
class PaginationCalculator {
    _currentPage;
    _pageSize;
    _totalItems;
    _maxPageSize;
    _numberOfPagesToShow;
    constructor(options = {
        currentPage: Default.currentPage,
        pageSize: Default.pageSize,
        totalItems: Default.totalItems,
        maxPageSize: Default.maxPageSize,
        numberOfPagesToShow: Default.numberOfPagesToShow
    }) {
        this._currentPage = options.currentPage;
        this._pageSize = options.pageSize;
        this._totalItems = options.totalItems;
        this._maxPageSize = options.maxPageSize;
        this._numberOfPagesToShow = options.numberOfPagesToShow;
    }
    get currentPage() {
        return this._currentPage;
    }
    set currentPage(currentPage) {
        if (this.validPage(currentPage)) {
            this._currentPage = currentPage;
        }
    }
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(pageSize) {
        if (pageSize > 0 && pageSize <= this._maxPageSize) {
            this._pageSize = pageSize;
        }
    }
    get totalItems() {
        return this._totalItems;
    }
    set totalItems(totalItems) {
        if (totalItems >= 0) {
            this._totalItems = totalItems;
        }
    }
    get totalPages() {
        return Math.ceil(this._totalItems / this._pageSize);
    }
    get needPagination() {
        return this._totalItems > 0;
    }
    get startItem() {
        return (this._currentPage - 1) * this._pageSize + 1;
    }
    get endItem() {
        return Math.min(this._currentPage * this._pageSize, this._totalItems);
    }
    goLeft() {
        this.goToPage(this._currentPage - 1);
    }
    goRight() {
        this.goToPage(this._currentPage + 1);
    }
    goToPage(page) {
        if (this.validPage(page)) {
            this._currentPage = page;
        }
        else {
            console.error('Page is invalid ', page);
        }
    }
    getPagesToServe() {
        const pages = [];
        const totalPages = this.totalPages;
        const currentPage = this._currentPage;
        const numberOfPagesToShow = this._numberOfPagesToShow;
        let pageStart = Math.max(1, currentPage - Math.floor(numberOfPagesToShow / 2));
        let pageEnd = Math.min(totalPages, pageStart + numberOfPagesToShow - 1);
        if (pageEnd - pageStart + 1 < numberOfPagesToShow) {
            if (currentPage - pageStart < Math.floor(numberOfPagesToShow / 2)) {
                pageEnd = Math.min(totalPages, pageEnd + (numberOfPagesToShow - (pageEnd - pageStart + 1)));
            }
            else {
                pageStart = Math.max(1, pageStart - (numberOfPagesToShow - (pageEnd - pageStart + 1)));
            }
        }
        for (let i = pageStart; i <= pageEnd; i++) {
            pages.push(i);
        }
        return pages;
    }
    validPage(page) {
        return page > 0 && page <= this._totalItems;
    }
    getPageOfItem(itemIndex) {
        return Math.floor(itemIndex / this._pageSize) + 1;
    }
}
class PaginationUi {
    _element;
    _options;
    _prevElement;
    _nextElement;
    _pageElement;
    _dotsElement;
    _listOfPageExist = [];
    _listDotsExist = [];
    _calculator;
    _galleryItems = [];
    constructor(element, options) {
        this._element = element;
        this._prevElement = SelectorEngine.findOne(SELECTOR_PREV, this._element);
        this._nextElement = SelectorEngine.findOne(SELECTOR_NEXT, this._element);
        this._pageElement = SelectorEngine.findOne(SELECTOR_PAGE, this._element);
        this._dotsElement = SelectorEngine.findOne(SELECTOR_DOTS, this._element);
        this._options = this._getOptions(options);
        this._galleryItems = SelectorEngine.find(`[data-pagination-gallery][data-key='${this._options.key}'] > *`);
        if (this._galleryItems.length > 0) {
            if (!options)
                options = Default;
            this._options['totalItems'] = this._galleryItems.length;
        }
        else {
            this._galleryItems = SelectorEngine.find(`[data-pagination-table][data-key='${this._options.key}'] tbody > tr`);
            if (this._galleryItems.length > 0) {
                if (!options)
                    options = Default;
                this._options['totalItems'] = this._galleryItems.length;
            }
        }
        const getParameterPage = getParam(this.param);
        if (getParameterPage) {
            this._options['currentPage'] = Number(getParameterPage);
        }
        this._calculator = new PaginationCalculator({
            currentPage: this._options.currentPage,
            pageSize: this._options.pageSize,
            totalItems: this._options.totalItems,
            maxPageSize: this._options.maxPageSize,
            numberOfPagesToShow: this._options.numberOfPagesToShow
        });
        if (this._element) {
            Data.setData(element, DATA_KEY, this);
            this._init();
        }
        if (this._galleryItems.length > 0) {
            this._initGallery();
        }
    }
    static get NAME() {
        return Name;
    }
    get param() {
        return this._options.key + '-page';
    }
    dispose() {
        if (!this._element) {
            return;
        }
        Data.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    _init() {
        if (!this._element)
            throw new Error('Element is null');
        if (!this._prevElement)
            throw new Error('Prev Element is null');
        if (!this._nextElement)
            throw new Error('Next Element is null');
        if (!this._pageElement)
            throw new Error('Page Element is null');
        if (!this._dotsElement)
            throw new Error('Dots Element is null');
        this._initPages();
        this._initDots();
        this._renderPage();
        this._attachEventListeners();
    }
    _initGallery() {
        this._galleryItems.forEach((item, index) => {
            const page = String(this._calculator.getPageOfItem(index));
            Manipulator.setDataAttribute(item, DATA_PAGINATION_GALLERY_KEY, page);
            item.classList.add('hidden');
        });
        this._renderPage();
    }
    _renderPage() {
        if (!this._element)
            throw new Error('Element is null');
        if (!this._prevElement)
            throw new Error('Prev Element is null');
        if (!this._nextElement)
            throw new Error('Next Element is null');
        if (!this._pageElement)
            throw new Error('Page Element is null');
        if (!this._dotsElement)
            throw new Error('Dots Element is null');
        if (!this._calculator.needPagination) {
            this._prevElement.classList.add('disabled');
            this._nextElement.classList.add('disabled');
        }
        else {
            this._prevElement.classList.remove('disabled');
            this._nextElement.classList.remove('disabled');
            if (this._calculator.currentPage === 1) {
                this._prevElement.classList.add('disabled');
            }
            else {
                this._prevElement.classList.remove('disabled');
            }
            if (this._calculator.currentPage === this._calculator.totalPages) {
                this._nextElement.classList.add('disabled');
            }
            else {
                this._nextElement.classList.remove('disabled');
            }
            const pages = this._calculator.getPagesToServe();
            const activePage = this._calculator.currentPage;
            const newURL = updateURLParameter(window.location.href, this.param, activePage.toString());
            window.history.replaceState({}, "", newURL);
            for (let i = 0; i < pages.length; i++) {
                const currentPage = pages[i];
                const page = this._listOfPageExist[i];
                page.classList.remove('hidden');
                page.classList.remove('active');
                page.setAttribute(DATA_PAGINATION_ATTRIBUTE, currentPage.toString());
                page.innerText = currentPage.toString();
                if (currentPage === activePage) {
                    page.classList.add('active');
                }
                else {
                    page.classList.remove('active');
                }
            }
            if (this._galleryItems.length > 0) {
                this._galleryItems.forEach((item) => {
                    const page = Manipulator.getDataAttribute(item, DATA_PAGINATION_GALLERY_KEY);
                    if (page) {
                        if (page === activePage) {
                            item.classList.remove('hidden');
                        }
                        else {
                            item.classList.add('hidden');
                        }
                    }
                });
            }
            if (pages.length < this._listOfPageExist.length) {
                for (let i = pages.length; i < this._listOfPageExist.length; i++) {
                    const page = this._listOfPageExist[i];
                    page.classList.add('hidden');
                }
            }
            const firstPage = pages[0];
            const lastPage = pages[pages.length - 1];
            if (firstPage > 1) {
                const dotsBefore = this._listDotsExist[0];
                dotsBefore.classList.remove('hidden');
                dotsBefore.classList.remove('active');
            }
            else if (firstPage === 1) {
                const dotsBefore = this._listDotsExist[0];
                dotsBefore.classList.add('hidden');
                dotsBefore.classList.remove('active');
            }
            if (lastPage < this._calculator.totalPages) {
                const dotsAfter = this._listDotsExist[1];
                dotsAfter.classList.remove('hidden');
                dotsAfter.classList.remove('active');
            }
            else if (lastPage === this._calculator.totalPages) {
                const dotsAfter = this._listDotsExist[1];
                dotsAfter.classList.add('hidden');
                dotsAfter.classList.remove('active');
            }
        }
    }
    _initPages() {
        if (!this._prevElement)
            throw new Error('Prev Element is null');
        if (!this._pageElement)
            throw new Error('Page Element is null');
        this._listOfPageExist = [];
        let currentElement = this._prevElement;
        for (let i = 0; i < this._options.numberOfPagesToShow; i++) {
            const newPage = currentElement.insertAdjacentElement('afterend', this._pageElement.cloneNode(true));
            newPage.classList.remove('active');
            newPage.classList.add('hidden');
            this._listOfPageExist.push(newPage);
            currentElement = newPage;
        }
        this._pageElement.remove();
    }
    _initDots() {
        if (!this._prevElement)
            throw new Error('Prev Element is null');
        if (!this._nextElement)
            throw new Error('Next Element is null');
        if (!this._dotsElement)
            throw new Error('Dots Element is null');
        const newDotsBefore = this._prevElement.insertAdjacentElement('afterend', this._dotsElement.cloneNode(true));
        newDotsBefore.classList.remove('active');
        newDotsBefore.classList.add('hidden');
        this._listDotsExist.push(newDotsBefore);
        const newDotsAfter = this._nextElement.insertAdjacentElement('beforebegin', this._dotsElement.cloneNode(true));
        newDotsAfter.classList.remove('active');
        newDotsAfter.classList.add('hidden');
        this._listDotsExist.push(newDotsAfter);
        this._dotsElement.remove();
    }
    _getOptions(options) {
        if (!this._element)
            throw new Error('Element is null');
        options = {
            ...Default,
            ...Manipulator.getDataAttributes(this._element),
            ...options
        };
        typeCheckConfig(Name, options, DefaultType);
        if (options == null) {
            throw new Error('Options is null');
        }
        return options;
    }
    _attachEventListeners() {
        EventHandler.on(this._prevElement, 'click', (event) => {
            event.preventDefault();
            this._calculator.goLeft();
            this._renderPage();
        });
        EventHandler.on(this._nextElement, 'click', (event) => {
            event.preventDefault();
            this._calculator.goRight();
            this._renderPage();
        });
        this._listOfPageExist.forEach((page) => {
            EventHandler.on(page, 'click', (event) => {
                event.preventDefault();
                const page = event.target;
                const pageValue = page.getAttribute(DATA_PAGINATION_ATTRIBUTE);
                if (pageValue) {
                    this._calculator.goToPage(Number(pageValue));
                    this._renderPage();
                }
            });
        });
    }
    static getInstance(element) {
        return Data.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = null) {
        return (this.getInstance(element) ||
            new this(element, typeof config === 'object' ? config : null));
    }
}
export default PaginationUi;
