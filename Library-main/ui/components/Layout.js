export default class Layout extends HTMLElement {
    rnedered = false;
    constructor() {
        super();
    }
    connectedCallback() {
        if (!this.rnedered) {
            this.render();
            this.rnedered = true;
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
        if (!this.shadowRoot)
            throw new Error('Shadow root not found');
        const slotContent = this.innerHTML;
        const styleInjection = this.getAttribute('style');
        this.shadowRoot.innerHTML = `
            <style>
                h1, h2, h3, h4, h5, h6, p {
                }
                h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
                h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                h5 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                h6 {
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                p {
                    font-size: 1rem;
                    margin-bottom: 0;
                    margin-top: 0;
                }
                a {
                    color: inherit;
                    text-decoration: none;
                }
                strong {
                    font-weight: 700;
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                li {
                    margin: 0;
                    padding: 0;
                }
                a:hover {
                    text-decoration: underline;
                }
                .cc-layout {
                    max-width: 100%;
                    width: 100%;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                }
                ${styleInjection}
            </style>
            <div class="cc-layout">
                ${slotContent}
            </div>
        `;
    }
}
