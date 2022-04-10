/**
 * This function has no effect if enumerate() has not been called.
 */
export declare function renumerate(afterAll?: boolean): void;
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
export declare function enumerate(): void;
