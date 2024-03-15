const SELECTOR_DATASET_TOGGLE = `data-toggle`;
const SELECTOR_DATASET_VIEW = `data-toggle-view`;
const SELECTOR_DATASET_VIEW_LINK = `data-toggle-link`;
const SELECTOR_DATASET_VIEW_DEFAULT = `data-toggle-default`;
const getNumberOfParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.toString().split("&").length;
};
export const getParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};
export const updateURLParameter = (url, param, paramVal) => {
    let newAdditionalURL = "";
    let tempArray = url.split("?");
    const baseURL = tempArray[0];
    const additionalURL = tempArray[1];
    let temp = "";
    if (additionalURL) {
        const tempArray = additionalURL.split("&");
        tempArray.forEach((item) => {
            if (item.split("=")[0] != param) {
                newAdditionalURL += temp + item;
                temp = "&";
            }
        });
    }
    const rowsTxt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rowsTxt;
};
export default class Toggle {
    _params;
    _views;
    _currentNumberOfParams = 0;
    constructor(_params = "view") {
        this._params = _params;
        this._views = document.querySelectorAll(this.selectorToggle(`[${SELECTOR_DATASET_VIEW}]`));
        if (!this._views.length) {
            console.warn("No views found for toggle " + this._params);
            return;
        }
        this.hideAllViews();
        this._currentNumberOfParams = getNumberOfParams();
        const view = this.getUrl();
        this.showView(view);
        const viewLinks = document.querySelectorAll(this.selectorToggle(`[${SELECTOR_DATASET_VIEW_LINK}]`));
        if (!viewLinks.length) {
            console.warn("No view links found for toggle " + this._params);
            return;
        }
        viewLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const view = link.dataset.toggleLink;
                if (!view) {
                    console.warn("No view found for toggle " + this._params);
                    return;
                }
                this.showView(view);
            });
        });
    }
    selectorToggle(select) {
        return `[${SELECTOR_DATASET_TOGGLE}="${this._params}"]${select}`;
    }
    getUrl() {
        return getParam(this._params);
    }
    hideAllViews() {
        this._views.forEach((view) => {
            view.classList.add("hidden");
            view.classList.remove("block");
        });
    }
    showView(view) {
        this.hideAllViews();
        if (view) {
            const currentViews = document.querySelectorAll(this.selectorToggle(`[${SELECTOR_DATASET_VIEW}="${view}"]`));
            if (!currentViews.length) {
                console.warn("No view found for toggle " + view + " " + this._params);
                this.showDefaultView();
                return;
            }
            currentViews.forEach((view) => {
                view.classList.remove("hidden");
                view.classList.add("block");
            });
            const currentViewActiveLinks = document.querySelectorAll(this.selectorToggle(`[${SELECTOR_DATASET_VIEW_LINK}].active`));
            currentViewActiveLinks.forEach((link) => {
                link.classList.remove("active");
            });
            const currentViewLinks = document.querySelectorAll(this.selectorToggle(`[${SELECTOR_DATASET_VIEW_LINK}="${view}"]:not(.active)`));
            if (!currentViewLinks.length) {
                console.warn("No view links found for toggle " + view + " " + this._params);
                return;
            }
            currentViewLinks.forEach((link) => {
                link.classList.add("active");
            });
            this.redirect(view);
        }
        else {
            this.showDefaultView();
        }
    }
    redirect(view) {
        const newURL = updateURLParameter(window.location.href, this._params, view);
        window.history.replaceState({}, "", newURL);
        setTimeout(() => {
            const lengthParams = getNumberOfParams();
            if (lengthParams != this._currentNumberOfParams) {
                this._currentNumberOfParams = lengthParams;
            }
        }, 100);
    }
    showDefaultView() {
        const defaultView = document.querySelector(this.selectorToggle(`[${SELECTOR_DATASET_VIEW_DEFAULT}]`));
        if (!defaultView) {
            console.warn("No default view found for toggle " + this._params);
            return;
        }
        const view = defaultView?.dataset[`toggleView`];
        if (!view) {
            console.warn("No view found for toggle " + this._params);
            return;
        }
        this.showView(view);
    }
}
