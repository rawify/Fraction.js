/**
 * @license Fraction.js v2.7.0 01/06/2015
 * http://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
function closestTapeMeasure(frac) {

    /*
    k/16 ≤ a/b < (k+1)/16
    ⇔ k ≤ 16*a/b < (k+1)
    ⇔ k = floor(16*a/b)
    */
    return new Fraction(Math.round(16 * Fraction(frac).valueOf()), 16);
}
console.log(closestTapeMeasure("1/3")); // 5/16
