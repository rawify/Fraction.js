/**
 * @license Fraction.js v2.7.0 01/06/2015
 * http://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
function closestTapeMeasure(frac) {

    // A tape measure is usually divided in parts of 1/16

    return Fraction(frac).roundTo("1/16");
}
console.log(closestTapeMeasure("1/3")); // 5/16
