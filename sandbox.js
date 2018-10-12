"use strict";
exports.__esModule = true;
var Fraction = require("./fraction");
var n = new Fraction(1, 3);
//console.log(n.toFraction());
console.log(n.add(2.5).toFraction(true));
var f = new Fraction(1, 3);
console.log(f.toFraction());
