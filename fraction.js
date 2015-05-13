/**
 * @license Fraction.js v1.8.0 12/05/2015
 * http://www.xarg.org/2014/03/precise-calculations-in-javascript/
 *
 * Copyright (c) 2014, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/


/**
 *
 * This class offers the possebility to calculate fractions.
 * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.
 *
 * Array/Object form
 * [ 0 => <nominator>, 1 => <denominator> ]
 * [ n => <nominator>, d => <denominator> ]
 *
 * Integer form
 * - Single integer value
 *
 * Double form
 * - Single double value
 *
 * String form
 * 123.456 - a simple double
 * 123/456 - A string fraction
 * 123.'456' - a double with repeating decimal places
 * 123.(456) - synonym
 * 123.45'6' - a double with repeating last place
 * 123.45(6) - synonym
 *
 * Example:
 *
 * var f = new Fraction("9.4'31'");
 * f.mul([-4, 3]).div(4.9);
 *
 * @constructor
 */
function Fraction(a, b) {

    "use strict";

    // Parsed data to avoid calling "new" all the time
    var P = {
        'n': 0,
        'd': 0,
        's': 0
    };

    var self = this;

    /**
     * Calculates the absolute value
     *
     * Ex: new Fraction(-4).abs() => 4
     **/
    self['abs'] = function() {

        self['s'] = 1;

        return self;
    };

    /**
     * Adds two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
     **/
    self['add'] = function(a, b) {

        parse(a, b);

        return cancel(
                self['s'] * self['n'] * P['d'] + P['s'] * self['d'] * P['n'],
                self['d'] * P['d']
                );
    };

    /**
     * Subtracts two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
     **/
    self['sub'] = function(a, b) {

        parse(a, b);

        return cancel(
                self['s'] * self['n'] * P['d'] - P['s'] * self['d'] * P['n'],
                self['d'] * P['d']
                );
    };

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    self['mul'] = function(a, b) {

        parse(a, b);

        return cancel(
                self['s'] * P['s'] * self['n'] * P['n'],
                self['d'] * P['d']
                );
    };

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").reciprocal().div(3)
     **/
    self['div'] = function(a, b) {

        parse(a, b);

        return cancel(
                self['s'] * P['s'] * self['n'] * P['d'],
                self['d'] * P['n']
                );
    };

    /**
     * Clones the actual object
     *
     * Ex: new Fraction("-17.(345)").clone()
     **/
    self['clone'] = function() {
        return new Fraction(this);
    };

    /**
     * Just sets a new number by parsing and canceling it
     *
     * Ex: new Fraction(0).set("100.'91823'") => 10091723 / 99999
     **/
    self['set'] = function(a, b) {

        parse(a, b);

        return cancel(
                P['s'] * P['n'],
                P['d']
                );
    };


    /**
     * Calculates the modulo of two rational numbers - a more precise fmod
     *
     * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
     **/
    self['mod'] = function(a, b) {

        parse(a, b);

        if (0 === (P['n'] * self['d'])) {
            return cancel(0, 0);
        }

        /*
         * First silly attempt, kinda slow
         *
         return that['sub']({
         'n': num['n'] * Math.floor((self.n / self.d) / (num.n / num.d)),
         'd': num['d'],
         's': self['s']
         });*/

        /*
         * New attempt: a1 / b1 = a2 / b2 * q + r
         * => b2 * a1 = a2 * b1 * q + b1 * b2 * r
         * => (b2 * a1 % a2 * b1) / (b1 * b2)
         */
        return cancel(
                (self['s'] * P['d'] * self['n']) % (P['n'] * self['d']),
                P['d'] * self['d']
                );
    };

    /**
     * Calculates the fractional gcd of two rational numbers
     * 
     * Ex: new Fraction(5,8).gcd(3,7) => 1/56
     */
    self['gcd'] = function(a, b) {

        parse(a, b);

        return cancel(gcd(P['n'], self['n']), P['d'] * self['d'] / gcd(P['d'], self['d']));
    };

    function round(round) {

        return function() {

            if (0 === (self['n'] = Math.abs(round(self['s'] * self['n'] / self['d'])))) {
                self['s'] = 0;
            }
            self['d'] = 1;

            return self;
        };
    }

    /**
     * Calculates the ceil of a rational number
     *
     * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
     **/
    self['ceil'] = round(Math.ceil);

    /**
     * Calculates the floor of a rational number
     *
     * Ex: new Fraction('4.(3)').floor() => (4 / 1)
     **/
    self['floor'] = round(Math.floor);

    /**
     * Rounds a rational numbers
     *
     * Ex: new Fraction('4.(3)').round() => (4 / 1)
     **/
    self['round'] = round(Math.round);

    /**
     * Gets the reciprocal form of the fraction, means numerator and denumerator are exchanged
     *
     * Ex: new Fraction([-3, 4]).reciprocal() => -4 / 3
     **/
    self['reciprocal'] = function() {

        return cancel(self['s'] * self['d'], self['n']);
    };

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    self['equals'] = function(a, b) {

        parse(a, b);

        return self['s'] * self['n'] * P['d'] === P['s'] * P['n'] * self['d']; // Same as compare() === 0
    };

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    self['compare'] = function(a, b) {

        parse(a, b);

        return (self['s'] * self['n'] * P['d'] - P['s'] * P['n'] * self['d']);
    };

    /**
     * Check if two rational numbers are divisible
     * 
     * Ex: new Fraction(19.6).divisible(1.5);
     */
    self['divisible'] = function(a, b) {

        parse(a, b);

        return !!(P['n'] * self['d']) && !((self['n'] * P['d']) % (P['n'] * self['d']));
    };

    /**
     * Returns a decimal representation of the fraction
     *
     * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
     **/
    self['valueOf'] = function() {

        return self['s'] * self['n'] / self['d'];
    };

    /**
     * Returns a string-fraction representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
     **/
    self['toFraction'] = function() {

        var rest = self['n'] % self['d'];

        if (self['n'] > self['d']) {

            if (self['n'] % self['d'] === 0) {
                return "" + (self['s'] * self['n'] / self['d']);
            }
            return (self['s'] * (self['n'] - rest) / self['d']) + " " + rest + "/" + self['d'];
        }
        return self['s'] * self['n'] + "/" + self['d'];
    };

    /**
     * Returns a latex representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toFraction() => "\frac{4}{3}"
     **/
    self['toLatex'] = function() {

        var str = "";

        if (self['s'] < 0) {
            str += '-';
        }

        if (self['d'] === 1) {
            str += self['n'];
        } else {
            str += '\frac{';
            str += self['n'];
            str += '}{';
            str += self['d'];
            str += '}';
        }
        return str;
    };

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    self['toString'] = function() {

        var p = String(self['n']).split(""); // Numerator chars
        var q = self['d']; // Denominator
        var t = 0; // Tmp var

        var ret = [~self['s'] ? "" : "-", "", ""]; // Return array, [0] is zero sign, [1] before comma, [2] after
        var zeros = ""; // Collection variable for zeros

        var cycLen = cycleLen(self['n'], self['d']); // Cycle length
        var cycOff = cycleStart(self['n'], self['d'], cycLen); // Cycle start

        var j = -1;
        var n = 1; // str index

        // rough estimate to fill zeros
        var length = 10 + cycLen + cycOff + p.length;  // 10 = decimal places when no repitation

        for (var i = 0; i < length; i++, t *= 10) {

            if (i < p.length) {
                t += Number(p[i]);
            } else {
                n = 2;
                j++; // Start now => after comma
            }

            if (cycLen > 0) { // If we have a repeating part
                if (j === cycOff) {
                    ret[n] += zeros + "(";
                    zeros = "";
                } else if (j === cycLen + cycOff) {
                    ret[n] += zeros + ")";
                    break;
                }
            }

            if (t >= q) {
                ret[n] += zeros + ((t / q) | 0); // Flush zeros, Add current digit
                zeros = "";
                t = t % q;
            } else if (n > 1) { // Add zeros to the zero buffer
                zeros += "0";
            } else if (ret[n]) { // If before comma, add zero only if already something was added
                ret[n] += "0";
            }
        }

        // If it's empty, it's a leading zero only
        ret[0] += ret[1] || "0";

        // If there is something after the comma, add the comma sign
        if (ret[2]) {
            return ret[0] + "." + ret[2];
        }
        return ret[0];
    };

    var parse = function(param, _b) {

        var n = 0, d = 1, s = 1;

        var A = 0, B = 1;
        var C = 1, D = 1;

        var N = 10000000;
        var M;

        var scale = 1;
        var mode = 0;

        if (_b !== undefined) {
            n = param;
            d = _b;
            s = param * _b;
        } else
            switch (typeof param) {

                case "object":

                    if (param === null) {

                    } else if ('d' in param && 'n' in param) {
                        n = param['n'];
                        d = param['d'];
                        s = n * d;
                        if ('s' in param) {
                            s *= param['s'];
                        }
                    } else if (0 in param) {
                        n = param[0];
                        if (1 in param)
                            d = param[1];
                        s = n * d;
                    } else {
                        throw "Unknown format";
                    }
                    break;

                case "number":

                    if (param < 0) {
                        param = -param;
                        s = -1;
                    }

                    if (param > 0) { // check for != 0, scale would become NaN (log(0)), which converges really slow

                        if (param >= 1) {
                            scale = Math.pow(10, Math.floor(1 + Math.log(param) / Math.LN10));
                            param /= scale;
                        }

                        // Using Farey Sequences
                        // http://www.johndcook.com/blog/2010/10/20/best-rational-approximation/

                        while (B <= N && D <= N) {
                            M = (A + C) / (B + D);

                            if (param === M) {
                                if (B + D <= N) {
                                    n = A + C;
                                    d = B + D;
                                } else if (D > B) {
                                    n = C;
                                    d = D;
                                } else {
                                    n = A;
                                    d = B;
                                }
                                break;

                            } else {

                                if (param > M) {
                                    A += C;
                                    B += D;
                                } else {
                                    C += A;
                                    D += B;
                                }

                                if (B > N) {
                                    n = C;
                                    d = D;
                                } else {
                                    n = A;
                                    d = B;
                                }
                            }
                        }
                        n *= scale;
                    }
                    break;

                case "string":

                    M = param.split("/");

                    if (M.length === 2) {
                        n = s = parseInt(M[0], 10);
                        d = parseInt(M[1], 10);
                        break;
                    }

                    M = param.split("");

                    /* mode:
                     0: before comma
                     1: after comma
                     2: in interval
                     3: after interval
                     */

                    A = [0, 0, 0, 0, 0], B = [0, 0, 0, 0, 0];
                    for (D = 0; D < M.length; D++) {

                        C = M[D];

                        if (C === '.') {

                            if (mode === 0) {
                                mode++;
                            } else {
                                break;
                            }
                        } else if (C === '(' || C === "'" || C === ')') {

                            if (0 < mode && mode < 3) { // mode === 1 || mode === 2
                                mode++;
                            } else {
                                break;
                            }
                        } else if (D === 0 && C === '+') {

                        } else if (D === 0 && C === '-') {
                            s = -1;
                        } else if (mode < 3 && !isNaN(C = parseInt(C, 10))) {
                            A[mode] = A[mode] * 10 + C;
                            B[mode]++;
                        } else {
                            break;
                        }
                    }
                    if (mode === 2 || D < M.length) {
                        throw "Corrupted number";
                    }


                    /*
                     13	98	112
                     -> 13 + (98 + 112 / 999) / 100
                     
                     ->
                     n:	((112 + 98 * 999) + 13 * (999 * 100))
                     d:	(999 * 100)
                     
                     -> ((c + b * x) + a * (x * y))	-> x*(ay+b)+c
                     n:	999 * (13 * 100 + 98) + 112
                     d:	999 * 100
                     */

                    A[3] = Math.pow(10, B[1]);
                    if (A[2] > 0)
                        A[4] = Math.pow(10, B[2]) - 1;
                    else
                        A[4] = 1;

                    n = A[2] + A[4] * (A[0] * A[3] + A[1]);
                    d = A[3] * A[4];
                    break;

                default:
                    throw "Unknown type";
            }

        set(P, s, n, d);
    };

    var sgn = function(n) {
        return (0 <= n) - (n < 0);
    };

    var set = function(dest, s, n, d) {

        if (!d) {
            throw "DIV/0";
        }

        dest['s'] = sgn(s);

        n = Math.abs(n);
        d = Math.abs(d);
        s = gcd(d, n); // Abuse var s

        dest['n'] = n / s;
        dest['d'] = d / s;
    };

    var cancel = function(n, d) {

        set(self, n, n, d);

        return self;
    };

    var modpow = function(b, e, m) {

        for (var r = 1; e > 0; b = (b * b) % m, e >>= 1) {

            if (e & 1) {
                r = (r * b) % m;
            }
        }
        return r;
    };

    var cycleLen = function(n, d) {

        if (d % 2 === 0) {
            return cycleLen(n, d / 2);
        }

        if (d % 5 === 0) {
            return cycleLen(n, d / 5);
        }

        for (var t = 1; t < 2000; t++) { // If you expect numbers longer then 2k chars repeating, increase the 2000
            // Solve 10^t == 1 (mod d) for d != 0 (mod 2, 5)
            // http://mathworld.wolfram.com/FullReptendPrime.html
            if (1 === modpow(10, t, d)) {
                return t;
            }
        }
        return 0;
    };

    var gpp = function(x) {

        for (var f = 1, n = 1, nn; x <= (nn = n * n); n++) {

            // Gives largest x such that x^2 is a factor of n: x * sqrt(n / x^2)
            if (0 === (x % nn)) {
                f = n;
            }
        }
        return f;
    };

    var cycleStart = function(n, d, len) {

        for (var s = 0; s < 300; s++) { // s < ~log10(Number.MAX_VALUE)
            // Solve 10^s == 10^(s+t) (mod d)
            if (modpow(10, s, d) === modpow(10, s + len, d))
                return s;
        }
        return 0;
    };

    var gcd = function(a, b) {
        var t;
        while (b) {
            t = a;
            a = b;
            b = t % b;
        }
        return a;
    };

    parse(a, b);

    self['s'] = P['s'];
    self['n'] = P['n'];
    self['d'] = P['d'];
}

if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = Fraction;
}
