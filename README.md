# lc-ref
A LaTeX style webcomponent reference and preview

This library provides a webcomponent to create numbered elements references and authomatic preview.

```html
<lc-ref href="#fig_1">fig. </lc-ref>
```
will probably render as "[fi.g 1](#fig_1)":

Cross documents links are supported:
```html
<lc-ref href="https://example.com#fig_1">fig. </lc-ref>
```
they will probably render as "[fig. _example_ .1 &#10697;](https://example.com#fig_1)"

## Motivation

I created this package to reference figures, tables, etc. like in LaTeX.

## Creating a numbered element

In your WebComponent, you have add the property:
```js
class MyWebcomponent extends HTMLElement {
    // ...

    lc_number = "auto";
}
```

If you want to provide a custom number or something else, write:

```js
class MyWebcomponent extends HTMLElement {
    // ...

    /**
     * @return {string}
     */
    lc_number() {
        return "42!";
    };
}
```