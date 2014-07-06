/**
 * @license Fraction.js v1.3.1 03/07/2014
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
function Fraction(param) {

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
    self['add'] = function() {

        var num = parse(arguments);

        return cancel(
            self['s'] * self['n'] * num['d'] + num['s'] * self['d'] * num['n'],
            self['d'] * num['d']
        );
    };

    /**
     * Subtracts two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
     **/
    self['sub'] = function() {

        var num = parse(arguments);

        return cancel(
            self['s'] * self['n'] * num['d'] - num['s'] * self['d'] * num['n'],
            self['d'] * num['d']
        );
    };

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    self['mul'] = function() {

        var num = parse(arguments);

        return cancel(
            self['s'] * num['s'] * self['n'] * num['n'],
            self['d'] * num['d']
        );
    };

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").reciprocal().div(3)
     **/
    self['div'] = function() {

        var num = parse(arguments);

        return cancel(
            self['s'] * num['s'] * self['n'] * num['d'],
            self['d'] * num['n']
        );
    };

    /**
     * Just sets a new number by parsing and canceling it
     *
     * Ex: new Fraction(0).set("100.'91823'") => 10091723 / 99999
     **/
    self['set'] = function() {

        var num = parse(arguments);

        return cancel(
            num['s'] * num['n'],
            num['d']
        );
    };


    /**
     * Calculates the modulo of two rational numbers - a more precise fmod
     *
     * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
     **/
    self['mod'] = function() {

        var num = parse(arguments);

        if (0 === (num['n'] * self['d'])) {
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
            (self['s'] * num['d'] * self['n']) % (num['n'] * self['d']),
            num['d'] * self['d']
        );
    };

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

    self['equals'] = function() {

        var num = parse(arguments);

        return num['s'] * num['n'] * self['d'] === self['s'] * self['n'] * num['d'];
    };

    /**
     * Check if two rational numbers are divisible
     * 
     * Ex: new Fraction(19.6).divisible(1.5);
     */
    self['divisible'] = function() {

        var num = parse(arguments);

        if (0 === (num['n'] * self['d'])) {
            return false;
        }

        return 0 === (self['n'] * num['d']) % (num['n'] * self['d']);
    };

    /**
     * Returns a decimal representation of the fraction
     *
     * Ex: new Fraction("100.'91823'").toNumber() => 100.91823918239183
     **/
    self['toNumber'] = function() {

        return self['s'] * self['n'] / self['d'];
    };

    /**
     * Returns a string-fraction representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
     **/
    self['toFraction'] = function() {

        if (self['n'] > self['d']) {

            if (self['n'] % self['d'] === 0) {
                return "" + (self['s'] * self['n'] / self['d']);
            } else {
                return (self['s'] * self['n'] / self['d'] | 0) + " " + (self['n'] % self['d']) + "/" + self['d'];
            }
        }
        return self['s'] * self['n'] + " / " + self['d'];
    };

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    self['toString'] = function() {

        var p = ("" + self['n']).split("");
        var q = self['d'];
        var t = 0;
        var u;

        var ret = "";

        var A = cycleLen(self['n'], self['d']);
        var B = cycleStart(self['n'], self['d'], A);

        var j = -1;

        // rough estimate to fill zeros
        var lo = 10 + A + B + p.length;

        for (var i = 0; i < lo; i++) {

            t*= 10;

            if (i < p.length) {
                t+= parseInt(p[i], 10);
            } else if (i === p.length) {
                ret+= ".";
                j = 0;
            } else {
                j++;
            }

            if (A > 0 && j === B) {
                ret+= "(";
            } else if (A > 0 && j - B === A) {
                ret+= ")";
                break;
            }

            if (t >= q) {
                // u = Math.floor(t / q);
                // t-= u * q;
                ret+= (t / q) | 0;
                t = t % q;
                // ret+= u;
            } else {
                ret+= "0";
            }
        }
        return (~self['s'] ? "" : "-") + trim0(ret);
    };

    var parse = function(param) {

        var n = 0, d = 1, s = 1;
        
        var A = 0, B = 1;
        var C = 1, D = 1;

        var N = 10000000;
        var M;

        var scale = 1;
        var mode = 0;

        if (param.length === 1) {
            param = param[0];
        } else if (param.length === 2) {
            /* void */
        } else {
            throw "Parameter mismatch";
        }

        switch (typeof param) {

            case "object":

                if (param === null) {

                } else if (param[0] !== undefined && param[1] !== undefined) {
                    n = param[0];
                    d = param[1];
                    s = n * d;
                } else if ('d' in param && 'n' in param) {
                    n = param['n'];
                    d = param['d'];
                    s = n * d;
                    if (param['s'] !== undefined) {
                        s *= param['s'];
                    }
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
                        param/= scale;
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
                                A+= C;
                                B+= D;
                            } else {
                                C+= A;
                                D+= B;
                            }

                            if (B > N) {
                                n = C;
                                d = D;
                            } else {
                                n = A;
                                d = B;
                            }
                        }
                    }
                    n*= scale;
                }
                break;

            case "string":

                M = param.split("");

                /* mode:
                 0: before comma
                 1: after comma
                 2: in interval
                 3: after interval
                 */

                A = [0, 0, 0, 0, 0], B = [0, 0, 0, 0, 0];
                for (D = 0; D < M.length; D++) {

                    if (M[D] === '.') {

                        if (mode === 0) {
                            mode++;
                        } else {
                            throw "Corrupted number";
                        }
                    } else if (M[D] === '(' || M[D] === "'" || M[D] === ')') {

                        if (0 < mode && mode < 3) { // mode !== 1 && mode !== 2
                            mode++;
                        } else {
                            throw "Corrupted number";
                        }
                    } else if (D === 0 && M[0] === '-') {
                        s = -1;
                    } else if (mode < 3) {

                        C = parseInt(M[D], 10);

                        if (isNaN(C)) {
                            throw "Corrupted number";
                        }
                        A[mode] = A[mode] * 10 + C;
                        B[mode]++;
                    } else {
                        throw "Corrupted number";
                    }
                }
                if (mode === 2) {
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

        if (!d) {
            // Throw the DIV/0 exception
            cancel(0, 0);
        }

        P['n'] = Math.abs(n); // Math.abs() allows us to save parseInt() calls (not that clean but just in case of API missuse)
        P['d'] = Math.abs(d);
        P['s'] = sgn(s);

        return P;
    };

    var sgn = function(n) {
        return (0 <= n) - (n < 0);
    };

    var cancel = function(n, d) {

        if (!d) {
            throw "DIV/0";
        }

        self['s'] = sgn(n);

        n = Math.abs(n);
        d = Math.abs(d);

        var a = n, b = d, t;

        while (b) {
            t = b;
            b = a % b;
            a = t;
        }

        self['n'] = n / a;
        self['d'] = d / a;

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

        for (var t = 1; t <= d; t++) {
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

        for (var s = 0; s < d; s++) {
            // Solve 10^s == 10^(s+t) (mod d)
            if (modpow(10, s, d) === modpow(10, s + len, d))
                return s;
        }
        return 0;
    };

    var trim0 = function(ret) {
        return ret.replace(/^0+([1-9]|0\.)/g, '$1').replace(/(\d)0+$/, '$1');
    };
    
    param = parse(arguments);

    cancel(param['s'] * param['n'], param['d']);
}

if (typeof module !== 'undefined' && module['exports']) {
    module['exports']['Fraction'] = Fraction;
}
