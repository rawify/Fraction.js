/**
 * @license Fraction.js v2.7.0 01/06/2015
 * http://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

function toFraction(frac) {

  var map = {
    '1:4': "¼",
    '1:2': "½",
    '3:4': "¾",
    '1:7': "⅐",
    '1:9': "⅑",
    '1:10': "⅒",
    '1:3': "⅓",
    '2:3': "⅔",
    '1:5': "⅕",
    '2:5': "⅖",
    '3:5': "⅗",
    '4:5': "⅘",
    '1:6': "⅙",
    '5:6': "⅚",
    '1:8': "⅛",
    '3:8': "⅜",
    '5:8': "⅝",
    '7:8': "⅞"
  };
  return map[frac.n + ":" + frac.d] || frac.toFraction(false);
}
console.log(toFraction(new Fraction(0.25))); // ¼
