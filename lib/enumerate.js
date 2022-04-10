import { LCRef, labelNumberAttributeName } from './lc-ref';
let lc_already_enumerated = false;
/**
 * This function has no effect if enumerate() has not been called.
 */
export function renumerate(afterAll = false) {
    if (!lc_already_enumerated && !afterAll) {
        return;
    }
    lc_already_enumerated = true;
    console.log("Renumerating labels...");
    let counter = 0;
    function getCounter() {
        return ++counter;
    }
    document.querySelectorAll('*').forEach(function (element) {
        if (Reflect.has(element, "lc_pre_numbering")) {
            let preNumbering = Reflect.get(element, "lc_pre_numbering");
            if (preNumbering instanceof Function) {
                preNumbering();
                return;
            }
            console.error(element, "has lc_pre_numbering but it's not a function");
        }
    });
    document.querySelectorAll("*").forEach(function (element) {
        // if the object has the "lc_number" property, we assume it is a label and assign a number
        // https://stackoverflow.com/questions/49707327/typescript-check-if-property-in-object-in-typesafe-way
        //if (Object.hasOwn(element, 'lc_number')) {
        if (Reflect.has(element, 'lc_number')) {
            let lc_number = Reflect.get(element, 'lc_number');
            if (typeof lc_number === 'string') {
                // if auto, assign a progressive number
                if (lc_number.toLowerCase() === 'auto') {
                    element.setAttribute(labelNumberAttributeName, getCounter().toString());
                    return;
                }
                element.setAttribute(labelNumberAttributeName, lc_number);
                return;
            }
            if (typeof lc_number === 'number') {
                element.setAttribute(labelNumberAttributeName, lc_number.toString());
                return;
            }
        }
        try {
            let result = element.lc_number(getCounter());
            if (typeof result === 'string') {
                element.setAttribute(labelNumberAttributeName, result);
                return;
            }
            if (typeof result === 'number') {
                element.setAttribute(labelNumberAttributeName, result.toString());
                return;
            }
            console.error("the lc_number function of ", element, " must return a string or a number");
        }
        catch (e) {
            // since we failed, the counter is not incremented
            --counter;
            //console.error(element, "has an invalid lc_number property, it must me either 'auto', a number or a (n : number) => {number | string}");
        }
    });
    document.querySelectorAll('*').forEach(function (element) {
        if (Reflect.has(element, "lc_post_numbering")) {
            let postNumbering = Reflect.get(element, "lc_post_numbering");
            if (postNumbering instanceof Function) {
                postNumbering();
                return;
            }
            console.error(element, "has lc_post_numbering but it's not a function");
        }
    });
    document.querySelectorAll('lc-ref').forEach(function (element) {
        if (element instanceof LCRef) {
            element.refresh();
        }
    });
}
/**
 * This function shall be called to start enumeratinf labels.
 * It is advised to call it at the end of the document and use renumerate() when
 * you want to update the numeration because renumerate() will not work if enumerate()
 * has been called before! This behaviour avoids unnecessary renumeration that could take
 * a while if the document contains a lot of labels.
 *
 * Suppose, for example that you have a document with N labels and you call enumerate()
 * every time, a component is connected, the enumeration will need a O(N^2) numbers changes.
 */
export function enumerate() {
    renumerate(true);
}
window.addEventListener("load", () => {
    enumerate();
});
