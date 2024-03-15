import listIcons from './iconList.js';
const iconNames = Object.keys(listIcons);
export default class Icon extends HTMLElement {
    rendered = false;
    constructor() {
        super();
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
    disconnectCallback() {
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback() {
        this.render();
    }
    adoptedCallback() {
    }
    render() {
        this.attachShadow({ mode: 'open' });
        const height = this.getAttribute('height') || '24';
        const width = this.getAttribute('width') || '24';
        const color = this.getAttribute('color') || 'inherit';
        const stroke = this.getAttribute('stroke') || '2';
        const name = this.getAttribute('name') || 'IconArrowNarrowRight';
        if (!(iconNames.includes(name))) {
            throw new Error(`Icon name ${name} is not valid`);
        }
        if (!this.shadowRoot)
            throw new Error('Shadow root not found');
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    height: ${height}px;
                    width: ${width}px;
                }
                :host svg{
                    color: ${color};
                    margin-bottom: -0.2em;
                }
            </style>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke-width=${stroke} stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round' width=${width} height=${height} >
                ${listIcons[name]()}
            </svg>
        `;
    }
}
