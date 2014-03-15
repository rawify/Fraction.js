# Fraction.js

Tired of inprecise numbers represented by doubles? Have a look at Fraction.js, which represents rational numbers as two integers in the form of *n / d*.


Examples
===
A simple example might be

```javascript
var f = new Fraction("9.4'31'");
f.mul([-4, 3]).mod("4.'8'");
```
The result is 

```javascript
f.s * f.n / f.d = -1 * 4154 / 1485 = -2.797306...
```

If you would try to calculate it yourself, you would come up with something like:

```javascript
(9.4313131 * (-4 / 3)) % 4.888888 = -2.797308133...
```

Quite okay, but yea - not as accurate as it could be.

To approximate a number like *sqrt(5) - 2 as n / d*, you can reformat the equation as follows: *pow(n / d + 2, 2) is 5*

The formulated algorithm, which also generates the binary representation, could look like

```javascript
var x = "/", s = "";

var a = new Fraction(0),
    b = new Fraction(1);
for (var n = 0; n <= 10; n++) {

    var c = new Fraction(a).add(b).div(2);

    console.log(n + "\t" + a.n + "/" + a.d + "\t" + b.n + "/" + b.d + "\t" + c.n + "/" + c.d + "\t" + x);

    if (Math.pow(c.n / c.d + 2, 2) < 5) {
        a = c;
        x = "1";
    } else {
        b = c;
        x = "0";
    }
    s+= x;
}
console.log(s)
```

The result is

```
n	a[n]		b[n]		c[n]			x[n]
0	0/1			1/1			1/2				/
1	0/1			1/2			1/4				0
2	0/1			1/4			1/8				0
3	1/8			1/4			3/16			1
4	3/16		1/4			7/32			1
5	7/32		1/4			15/64			1
6	15/64		1/4			31/128			1
7	15/64		31/128		61/256			0
8	15/64		61/256		121/512			0
9	15/64		121/512		241/1024		0
10	241/1024	121/512		483/2048		1
```
Thus the approximation after 11 iterations is *483/2048* and the binary representation is 0,00111100011 (see [WolframAlpha](http://www.wolframalpha.com/input/?i=sqrt%285%29-2+binary))


I published another example on how to approximate PI with fraction.js on my [blog](http://www.xarg.org/2014/03/precise-calculations-in-javascript/).


fmod() impreciseness circumvented
---
It turns out that Fraction.js outperforms almost any fmod() implementation, including JavaScript itself, C++, Python, Java and even Wolframalpha due to the fact that numbers like 0.05, 0.1, ... are infinite decimal in base 2.

The equation *fmod(4.55, 0.05) or 4.55 % 0.05* gives *0.04999999999999957*, wolframalpha says 1/20. The correct answer should be **zero**, as 0.05 divides 4.55 without any remainder.

Parser
===

Any function (see below) as well as the constructor of the *Fraction* class parses it's input and cancel it to the smallest term.

You can pass either Arrays, Objects, Integers, Doubles or Strings.

Arrays / Objects
---
```javascript
new Fraction([numerator, denumerator]);
new Fraction({n: numerator, d: denumerator});
new Fraction({z: numerator, n: denumerator}); // German syntax (z: Zähler, n: Nenner)
```

Integers
---
```javascript
new Fraction(123);
```

Doubles
---
```javascript
new Fraction(55.4);
```

Strings
---
```javascript
new Fraction("123.45");
new Fraction("123,456"); // German notation
new Fraction("123.'456'"); // Note the quotes, see below!
new Fraction("123.(456)"); // Note the brackets, see below!
new Fraction("123.45'6'"); // Note the quotes, see below!
new Fraction("123.45(6)"); // Note the brackets, see below!
```

Repeating decimal places
---
*Fraction.js* can easily handle repeating decimal places. For example *1/3* is *0.3333...*. There is only one repeating digit. As you can see in the examples above, you can pass a number like *1/3* as "0.'3'" or "0.(3)", which are synonym.

Assume you want to divide 123.32 / 33.6(567). [WolframAlpha](http://www.wolframalpha.com/input/?i=123.32+%2F+%2812453%2F370%29) states that you'll get a period of 1776 digits. *Fraction.js* comes to the same result. Give it a try:

```
var f = new Fraction("123.32");
console.log("Bam: " + f.div("33.6(567)"));
```


Functions
===

Fraction abs()
---
Returns the actual number without any sign information

Fraction add(n)
---
Returns the sum of the actual number and the parameter n

Fraction sub(n)
---
Returns the difference of the actual number and the parameter n

Fraction mul(n)
---
Returns the product of the actual number and the parameter n

Fraction div(n)
---
Returns the quotient of the actual number and the parameter n

Fraction set(n)
---
Set a number n to the actual object

Fraction mod(n)
---
Returns the modulus (rest of the division) of the actual object and n (this % n). It's a much more precise [fmod()](http://phpjs.org/functions/fmod/) if you will. 

Fraction reciprocal()
---
Returns the reciprocal of the actual number (n / d becomes d / n)

boolean equals(n)
---
Check if two numbers are equal

boolean divisible(n)
---
Check if two numbers are divisible (n divides this)

Fraction sqrt()
---
Calculates a rational approximation of the square root of the actual number

String toString()
---
Generates an exact string representation of the actual object, including repeating decimal places of any length.


Exceptions
===
If a really hard error occurs (parsing error, division by zero), *fraction.js* throws exceptions! Please make sure you handle them correctly.



Installation
===
Installing fraction.js is as easy as cloning this repo or use one of the following commands:

```
bower install fraction.js
```
or

```
npm install fraction.js
```


Coding Style
===
As every library I publish, fraction.js is also built to be as small as possible after compressing it with Google Closure Compiler in advanced mode. Thus the coding style orientates a little on maxing-out the compression rate. Please make sure you keep this style if you plan to extend the library.


Testing
===
If you plan to enhance the library, make sure you add test cases and all the previous tests are passing. You can test the library with

```
npm test
```


Copyright and licensing
===
Copyright (c) 2014, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
