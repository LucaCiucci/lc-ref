
/**
 * The attribute used to store the label number
 */
export var labelNumberAttributeName = 'data-lc-label-number';

/**
 * The lc-ref element is used to reference a label in the document.
 * 
 * usage example:
 * ```html
 * <tex-math id="equation">
 *   x^2
 * </tex-math>
 * Try to hover this reference: <lc-ref href="#equation">eq. <lc-ref>
 * ```
 * Note that the [tex-math](https://www.npmjs.com/package/tex-math) package natively supports lc-ref.
 */
export class LCRef extends HTMLElement {

    /**
     * This is the delay in milliseconds before the preview is displayed/hidden.
     */
    public preview_delay = 500;

    /**
     * All the visible content will be inside this root element
     */
    private my_root?: HTMLElement;

    /**
     * This is the visible link
     */
    private link_element?: HTMLElement;

    /**
     * This is the reference display, for example in "eq. 3" the ref_display will be "3".
     */
    private ref_display?: HTMLElement;

    /**
     * This is used to store the reference to the swowing/hiding timeout
     */
    private preview_timeout : number = 0;

    /**
     * When present, the preview element will be displayed over every other element.
     */
    private preview_element : HTMLElement | null = null;

    /**
     * This is the element being referenced
     */
    private ref_element : HTMLElement | null = null;

    constructor() {
        super();

        // nothing to do here, we will use the connectedCallback() function to create the shadow DOM.
    }


    connectedCallback() {
        // Here we create a shadow DOM for the element since it might not be created in the constructor.

        // we create the shadow root.
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot == null) {
            console.error("LCRef: shadowRoot is null despite attachShadow({ mode: 'open' }) being called");
            throw new Error("Shadow DOM not supported");
        }

        // fill the shadowroot
        this.createShadowContent();

        // provide the preview on hover functionality
        this.onmouseover = this.onmouseover_impl.bind(this);
        this.onmouseout = this.onmouseout_impl.bind(this);
    }

    /**
     * creates the shadow DOM content
     */
    private createShadowContent() : void {

        // We setup the styles, then we add the visible link.

        this.setupStyle();

        // we create an element that will be the root element for our content
        // this is necessary to correctly position the preview element
        this.createMyRoot();

        this.createLink();
    }

    /**
     * This functin sets the hyperlink style.
     */
    private setupStyle() : void {
        this.style.display = "inline-block";

        let style = document.createElement("style");

        // the hyperlink style.
        style.innerHTML +=
`
a { color: var(--link-color, blue); }
`;

        // the preview style.
        style.innerHTML +=
`
.preview {
    position: absolute;
    padding: 0.5em;
    /*background-color: var(--preview-background-color);*/
    background-color: rgb(30, 30, 30);
    /*color: var(--preview-color);*/
    color: white;
    color: var(220, 220, 220);
    /*border: 1px solid var(--preview-border-color);*/
    border: 1px solid gray;
    border-radius: 0.5em;
    font-size: 75%;
    z-index: 1000;
    top: 125%;
    left: 50%;
    transform: translate(-50%, 0);
    transform: translate(-25%, 0);

    max-width: 50vw;
    overflow: auto;
}
`;

        this.shadowRoot!.appendChild(style);
    }

    private createMyRoot() : void {
        // we create the root element.
        this.my_root = document.createElement("span");
        let my_root = this.my_root;

        // we set the style of the root element so that it will be displayed inline and the tooltip will be displayed on top of it.
        my_root.style.display = "inline-block";
        my_root.style.position = "relative";

        // we add the root to the shadow DOM.
        this.shadowRoot!.appendChild(this.my_root);
    }

    private createLink() : void {
        // we create the link element.
        this.link_element = document.createElement("a");
        this.link_element.innerHTML = '<slot></slot>';
        this.my_root!.appendChild(this.link_element);

        this.createRefDisplay();
    }

    private createRefDisplay() : void {
        // we create the ref display element.
        this.ref_display = document.createElement("span");
        this.link_element!.appendChild(this.ref_display);

        this.ref_display.innerText = "...";
    }

    private getRefDisplay(element : HTMLElement) : void {
        element.innerText = "???";

        let href = this.getAttribute("href")!;

        this.ref_element = null;
        if (href.startsWith("#") && !href.endsWith('#')) {
            let ref_element = document.getElementById(href.slice(1));
            this.ref_element = ref_element;

            if (ref_element == null) {
                console.warn("in the element", this, ", could not find the element with id", href.slice(1));
                element.innerText = "??";
                return;
            }

            let label_number = ref_element.getAttribute(labelNumberAttributeName);
            if (label_number == null) {
                console.warn("in the element", this, "could not find the attribute", labelNumberAttributeName, "in the element", ref_element);
                element.innerText = "?";
            } else {
                element.innerText = label_number;
            }
            return;
        }

        element.innerHTML = "";

        // TODO load the page title and target number, for now we will use a simpler solution:
        console.log(href);
        if (href.includes('#') && !href.endsWith('#')) {
            element.innerText = "#" + href.split('#')[1];
        }

        element.innerHTML += " &#10697;";
        return;
    }
    
    public refresh() {
        let href = this.getAttribute("href")
        if (href == null || href == "") {
           this.setAttribute("href", "#");
           href = "#";
        }

        this.link_element?.setAttribute("href", href);
        this.getRefDisplay(this.ref_display!);
    }

    // here we add the "preview on hover" functionality.
    private onmouseover_impl() {
        // remove any previous timeout
        this.remove_preview_timeout();


        this.preview_timeout = window.setTimeout(this.createPreview.bind(this), this.preview_delay);
    }

    // here we add the "hide preview on mouseout" functionality.
    private onmouseout_impl() {
        // remove any previous timeout
        this.remove_preview_timeout();

        this.preview_timeout = window.setTimeout(this.removePreview.bind(this), this.preview_delay);
    }

    public hasPreview() : boolean {
        return this.preview_element != null;
    }

    createPreviewElement() {
        // we create the preview element.
        this.preview_element = document.createElement("div");
        this.preview_element.className = "preview";
        this.preview_element.innerHTML = "...loading...";

        this.my_root!.appendChild(this.preview_element);
    }

    private createPreview() : void {
        if (this.hasPreview()) {
            return;
        }

        // remove any previous timeout
        this.remove_preview_timeout();

        // create the preview element.
        this.createPreviewElement();

        // set the preview content.
        this.fillPrevew(this.preview_element!);

        if (this.preview_element!.innerHTML == "") {
            this.removePreview();
        }

        // set the preview position.
        //this.setPreviewPosition();
    }

    private removePreview() : void {
        /*if (this.preview_element != null) {
            this.preview_element.remove();
            this.preview_element = null;
        }*/
        this.my_root!.querySelectorAll(".preview").forEach(e => e.remove());
        this.preview_element = null;
    }

    private remove_preview_timeout() : void {
        if (this.preview_timeout != 0) {
            clearTimeout(this.preview_timeout);
            this.preview_timeout = 0;
        }
    }

    private fillPrevewForElement(preview : HTMLElement, element : HTMLElement) : boolean {

        // We try to get the element preview by calling element.lc_build_ref_preview,
        // in case of exception (for example if the element does not have this method)
        // we clear the preview and return false.

        preview.innerHTML = "";

        try {
            // typescript does not allow to call a method of an object that is not a function.
            // We could have used Reflect.get but I understood that it works only for properties and not methods

            (element as any).lc_build_ref_preview(preview);

            // success
            return true;
        } catch (e) {

            //console.error(e);

            // clear the preview.
            preview.innerHTML = "";

            // fail
            return false;
        }
    }

    private fillPrevew(preview : HTMLElement) {
        preview.innerText = "...";

        if (this.ref_element != null) {
            this.fillPrevewForElement(preview, this.ref_element);
            return;
        }

        let href = this.getAttribute("href")!;

        /* at this point, we know that the href is not an id.
         * If the links points to an element inside a page, we will try to display the element preview.
         * In all other cases, we will display the page preview inside an iframe.
         */
        {
            preview.innerHTML = "";

            // we create a "loading..." display
            let loading_span = document.createElement("span");
            loading_span.innerText = "loading...";
            preview.appendChild(loading_span);

            // we create the iframe we will load the target page into.
            let iframe = document.createElement("iframe");

            // we will decide if we show the iframe or a preview later, inside the iframe.onload callback.
            iframe.style.display = "none";

            iframe.style.backgroundColor = "white";

            // we set the iframe src.
            iframe.src = href;

            // we add the iframe to the preview. This will start the loading of the iframe.
            preview.appendChild(iframe);

            iframe.onload = () => {
                let target_has_preview = false;
                try {
                    //let iframe_content = iframe.contentDocument!.documentElement!.innerHTML;
                    let innerDoc = iframe.contentDocument || iframe.contentWindow?.document;

                    if (href.includes("#") && !href.endsWith("#")) {
                        let id = href.split("#")[1];

                        let element = innerDoc!.getElementById(id);
                        if (element != null) {
                            // avoid the fillPrevewForElement to delete the iframe
                            let span = document.createElement("span");
                            preview.appendChild(span);

                            target_has_preview = this.fillPrevewForElement(span, element);
                        }
                    }
                } catch (e) {
                    console.warn("could not access the remote document: ", e, ". Using the iframe preview...");
                }

                // at this point the preview content is loaded.
                loading_span.remove();

                // now, choose if we show the preview or the ifram preview.
                if (target_has_preview) {
                    // if the target has managed to create a preview, we do not show the iframe.
                    iframe.remove();
                } else {
                    // if the target has not managed to create a preview, we show the target page inside the iframe.
                    iframe.style.display = "block";
                }
            };

            return;
        }

    }
}

if (!customElements.get("lc-ref")) {
    customElements.define("lc-ref", LCRef);
}