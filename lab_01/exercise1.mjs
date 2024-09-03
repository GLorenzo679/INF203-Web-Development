"use strict";

//0 1 1 2 3 5 8 13 21 34 55 89 144

// no recursion
export function fibonaIt(n) {
    let a = 0;
    let b = 1;
    let c = 0;
    let i = 0;

    while (i < n) {
        c = a + b;
        a = b;
        b = c;
        i++;
    }
    return a;
}

// recursive programming
export function fiboRec(n) {
    if (n <= 1) return n;

    return fiboRec(n - 1) + fiboRec(n - 2);
}

// no map function
export function fibonaArr(t) {
    for (let i = 0; i < t.length; i++)
        t[i] = fiboRec(t[i]);

    return t;
}

// with map
export function fibMap(t) {
    t = t.map((x) => fiboRec(x));

    return t;
}