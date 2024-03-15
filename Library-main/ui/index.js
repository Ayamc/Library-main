import Rating from "./components/Rating.js";
import Icon from "./components/Icon.js";
import CountDown from "./components/CountDown.js";
import Toggle from "./components/Toggle.js";
import initLib from "./auto_init/index.js";
import Pagination from "./components/Pagination.js";
import Layout from './components/Layout.js';
import Toast from "./components/Toast.js";
export { default as typed } from "./lib/typed/typed.js";
if ("customElements" in window) {
    window.customElements.define("ui-icon", Icon);
    window.customElements.define("ui-layout", Layout);
}
initLib({
    Rating, CountDown, Pagination, Toast
});
export { Rating, Toggle, initLib, CountDown, Pagination };
const progressBars = document.querySelectorAll(".cc-progress");
progressBars.forEach((progress) => {
    const progressChild = progress.children[0];
    const percent = progress.getAttribute("data-percent") || 0;
    setTimeout(() => {
        progressChild.style.transform = "translateX(-" + (100 - Number(percent)) + "%)";
    }, 1000);
});
const goToLink = (link) => {
    if (!link) {
        console.error("No link found");
        return;
    }
    try {
        new URL(link);
        window.location.href = link;
    }
    catch (err) {
        console.error(err);
    }
};
const cards = document.querySelectorAll(".cc-card-clickable");
cards.forEach((card) => {
    card.addEventListener("click", (_) => {
        const link = card.dataset.link;
        goToLink(link);
    });
});
