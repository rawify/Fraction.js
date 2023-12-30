/**
 * @license Fraction.js v2.7.0 01/06/2015
 * http://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
 
// Calculates (a/b)^(c/d) if result is rational
// Derivation: https://raw.org/book/analysis/rational-numbers/
function root(a, b, c, d) {

  // Initial estimate
  let x = Fraction(100 * (Math.floor(Math.pow(a / b, c / d)) || 1), 100);
  const abc = Fraction(a, b).pow(c);

  for (let i = 0; i < 30; i++) {
    const n = abc.mul(x.pow(1 - d)).sub(x).div(d).add(x)

    if (x.n === n.n && x.d === n.d) {
      return n;
    }
    x = n;
  }
  return null;
}

root(18, 2, 1, 2); // 3/1
