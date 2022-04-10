/**
 * The attribute used to store the label number
 */
export declare var labelNumberAttributeName: string;
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
export declare class LCRef extends HTMLElement {
    /**
     * This is the delay in milliseconds before the preview is displayed/hidden.
     */
    preview_delay: number;
    /**
     * All the visible content will be inside this root element
     */
    private my_root?;
    /**
     * This is the visible link
     */
    private link_element?;
    /**
     * This is the reference display, for example in "eq. 3" the ref_display will be "3".
     */
    private ref_display?;
    /**
     * This is used to store the reference to the swowing/hiding timeout
     */
    private preview_timeout;
    /**
     * When present, the preview element will be displayed over every other element.
     */
    private preview_element;
    /**
     * This is the element being referenced
     */
    private ref_element;
    constructor();
    connectedCallback(): void;
    /**
     * creates the shadow DOM content
     */
    private createShadowContent;
    /**
     * This functin sets the hyperlink style.
     */
    private setupStyle;
    private createMyRoot;
    private createLink;
    private createRefDisplay;
    private getRefDisplay;
    refresh(): void;
    private onmouseover_impl;
    private onmouseout_impl;
    hasPreview(): boolean;
    createPreviewElement(): void;
    private createPreview;
    private removePreview;
    private remove_preview_timeout;
    private fillPrevewForElement;
    private fillPrevew;
}
