/**
 * @license Fraction.js v2.7.0 01/06/2015
 * http://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
 
// Calculates (a/b)^(c/d) if result is rational
function root(a, b, c, d) {

  // Initial estimate
  var xn = Fraction(Math.floor(Math.pow(a / b, c / d)));
  var ab = Fraction(a, b);

  for (var i = 0; i < 30; i++) {
    var xp = xn.sub(xn.pow(d).sub(ab.pow(c)).div(xn.pow(d - 1).mul(d)));

    if (xp.n === xn.n && xp.d === xn.d) {
      return xp;
    }
    xn = xp;
  }
  return null;
}

root(18, 2, 1, 2); // 3/1

/* derivation:

Root: x = (a/b)^(c/d)
  <=> x^d = (a/b)^c
  <=> x^d - (a/b)^c = 0

f(x) = x^d - (a/b)^c
f'(x) = dx^(d-1)

Newton method:
xp = xn - f(x) / f'(x)

*/
