/**
 * @license Fraction.js v1.0.0 12/03/2014
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
 * [ z => <nominator>, n => <denominator> ]
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
 * 123,456 - a simple double in german notation
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


    /**
     * Calculates the absolute value
     *
     * Ex: new Fraction(-4).abs() => 4
     **/
    this['abs'] = function() {

        return cancel.call(this,
            this['n'],
            this['d']
        );
    };

    /**
     * Adds two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
     **/
    this['add'] = function(num) {

        num = parse(arguments);

        return cancel.call(this,
            this['s'] * this['n'] * num['d'] + num['s'] * this['d'] * num['n'],
            this['d'] * num['d']
        );
    };

    /**
     * Subtracts two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
     **/
    this['sub'] = function(num) {

        num = parse(arguments);

        return cancel.call(this,
            this['s'] * this['n'] * num['d'] - num['s'] * this['d'] * num['n'],
            this['d'] * num['d']
        );
    };

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    this['mul'] = function(num) {

        num = parse(arguments);

        return cancel.call(this,
            this['s'] * num['s'] * this['n'] * num['n'],
            this['d'] * num['d']
        );
    };

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").reciprocal().div(3)
     **/
    this['div'] = function(num) {

        num = parse(arguments);

        return cancel.call(this,
            this['s'] * num['s'] * this['n'] * num['d'],
            this['d'] * num['n']
        );
    };

    /**
     * Just sets a new number by parsing and canceling it
     *
     * Ex: new Fraction(0).set("100.'91823'") => 10091723 / 99999
     **/
    this['set'] = function(num) {

        num = parse(arguments);

        return cancel.call(this,
            num['s'] * num['n'],
            num['d']
        );
    };
    

    /**
     * Calculates the modulo of two rational numbers - a more precise fmod
     *
     * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
     **/
    this['mod'] = function(num) {

        num = parse(arguments);

        if (0 === (num['n'] * this['d'])) {
            return cancel.call(this, 0, 0);
        }

        /*
         * First silly attempt, kinda slow
         *
         return this['sub']({
         'n': num['n'] * Math.floor((this.n / this.d) / (num.n / num.d)),
         'd': num['d'],
         's': this['s']
         });*/

        /*
         * New attempt: a1 / b1 = a2 / b2 * q + r
         * => b2 * a1 = a2 * b1 * q + b1 * b2 * r
         * => (b2 * a1 % a2 * b1) / (b1 * b2)
         */
        return cancel.call(this,
            (this['s'] * num['d'] * this['n']) % (num['n'] * this['d']),
            num['d'] * this['d']
        );
    };

    /**
     * Gets the reciprocal form of the fraction, means numerator and denumerator are exchanged
     *
     * Ex: new Fraction([-3, 4]).reciprocal() => -4 / 3
     **/
    this['reciprocal'] = function() {

        return cancel.call(this, this['s'] * this['d'], this['n']);
    };

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/

    this['equals'] = function(num) {

        num = parse(arguments);

        return num['s'] * num['n'] * this['d'] === this['s'] * this['n'] * num['d'];
    };

    /**
     * Check if two rational numbers are divisible
     * 
     * Ex: new Fraction(19.6).divisible(1.5);
     */
    this['divisible'] = function(num) {

        num = parse(arguments);

        return 0 === (this['n'] * num['d']) % (num['n'] * this['d']);
    };

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    this['toString'] = function() {

        var p = ("" + this['n']).split("");
        var q = this['d'];
        var t = 0;
        var u;

        var ret = "";

        var A = cycleLen(this['n'], this['d']);
        var B = cycleStart(this['n'], this['d'], A);

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
                ret+= (t / q) | 0;
                t = t % q;
                // ret+= u;
            } else {
                ret+= "0";
            }
        }
        return (~this['s'] ? "" : "-") + trim0(ret);
    };

    var parse = function(param) {

        var n, d, s = 1;
        
        if (param.length === 1) {
            param = param[0];
        } else if (param.length === 2) {
            /* void */
        } else {
            throw "Parameter mismatch";
        }

        switch (typeof param) {

            case "object":

                if (param[0] !== undefined && param[1] !== undefined) {
                    n = param[0];
                    d = param[1];
                    s = n * d;
                    break;
                } else if ('d' in param && 'n' in param) {
                    n = param['n'];
                    d = param['d'];
                    s = n * d;
                    if (param['s'] !== undefined) {
                        s *= param['s'];
                    }
                    break;
                } else if ('z' in param && 'n' in param) {
                    n = param['z'];
                    d = param['n'];
                    s = n * d;
                    break;
                } else {
                    throw "Unknown format";
                }

            case "string":

                // Trim WS
                param = param.replace(/^[\s]+/g, '').replace(/[\s]+$/, '').replace(',', '');

            case "number":

                param = ("" + param);

                var p = param.split("");

                /* mode:
                 0: before comma
                 1: after comma
                 2: in interval
                 3: after interval
                 */

                var m = [0, 0, 0, 0, 0], u = [0, 0, 0, 0, 0], c, mode = 0;
                for (var i = 0; i < p.length; i++) {

                    if (p[i] === '.') {

                        if (mode === 0) {
                            mode++;
                        } else {
                            throw "Corrupted number";
                        }
                    } else if (p[i] === '(' || p[i] === "'" || p[i] === ')') {

                        if (0 < mode && mode < 3) { // mode !== 1 && mode !== 2
                            mode++;
                        } else {
                            throw "Corrupted number";
                        }
                    } else if (i === 0 && p[0] === '-') {
                        s = -1;
                    } else if (mode < 3) {

                        c = parseInt(p[i], 10);

                        if (isNaN(c)) {
                            throw "Corrupted number";
                        }
                        m[mode] = m[mode] * 10 + c;
                        u[mode]++;
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

                m[3] = Math.pow(10, u[1]);
                if (m[2] > 0)
                    m[4] = Math.pow(10, u[2]) - 1;
                else
                    m[4] = 1;

                n = m[2] + m[4] * (m[0] * m[3] + m[1]);
                d = m[3] * m[4];
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
        return (0 < n) - (n < 0);
    };

    var cancel = function(n, d) {

        if (!d) {
            throw "DIV/0";
        }

        this['s'] = sgn(n);

        n = Math.abs(n);
        d = Math.abs(d);

        var a = n, b = d, t;

        while (b) {
            t = b;
            b = a % b;
            a = t;
        }

        this['n'] = n / a;
        this['d'] = d / a;

        return this;
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
        return ret.replace(/^0+([1-9]|0\.)/g, '$1').replace(/(\d)0+$/, '$1')
    };

    this['n'] = this['s'] = 0;
    this['d'] = 1;

    // Parsed data to avoid calling "new" all the time
    var P = {
        'n': 0,
        'd': 0,
        's': 0
    };

    param = parse(arguments);

    cancel.call(this, param['s'] * param['n'], param['d']);
}

if (typeof module !== 'undefined' && module['exports']) {
    module['exports']['Fraction'] = Fraction;
}
