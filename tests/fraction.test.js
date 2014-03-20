
var assert = require('assert');

var fraction = new (require('../fraction.min').Fraction)(0);

var tests = [{
        set: "foo",
        expect: "Corrupted number"
    }, {
        set: null,
        expect: "0.0" // I would say it's just fine
    }, {
        set: [22, 7],
        expect: '3.(142857)' // We got Pi! - almost ;o
    }, {
        set: "0.09(33)",
        expect: "0.09(3)"
    }, {
        set: 1 / 2,
        expect: "0.5"
    }, {
        set: "0.'3'",
        expect: "0.(3)"
    }, {
        set: "0.00002",
        expect: "0.00002"
    }, {
        set: 7 / 8,
        expect: "0.875"
    }, {
        set: 4,
        expect: "4.0"
    }, {
        set: -99,
        expect: "-99.0"
    }, {
        set: -92332.1192,
        expect: "-92332.1192"
    }, {
        set: '88.92933(12111)',
        expect: "88.92933(12111)"
    }, {
        set: '-192322.823(123)',
        expect: "-192322.8(231)"
    }, {
        label: "-99.12 % 0.09(34)",
        set: '-99.12',
        fn: "mod",
        param: "0.09(34)",
        expect: "-0.07(95)"
    }, {
        label: "-187 % 12",
        set: '-187',
        fn: "mod",
        param: "12",
        expect: "-7.0"
    }, {
        label: "Negate by 99 * -1",
        set: '99',
        fn: "mul",
        param: "-1",
        expect: "-99.0"
    }, {
        label: "99.(9) + 66",
        set: '99.(999999)',
        fn: "add",
        param: "66",
        expect: "166.0"
    }, {
        label: "-82.124 / 66.(3)",
        set: '-82.124',
        fn: "div",
        param: "66.(3)",
        expect: "-1.238(050251256281407035175879396984924623115577889447236180904522613065326633165829145728643216080402010)"
    }, {
        label: "100 - .91",
        set: '100',
        fn: "sub",
        param: ".91",
        expect: "99.09"
    }, {
        label: "381.(33411) % 11.119(356)",
        set: '381.(33411)',
        fn: "mod",
        param: "11.119(356)",
        expect: "3.275(997225017295217)"
    }, {
        label: "-222/3",
        set: {
            n: 3,
            d: 222,
            s: -1
        },
        fn: "reciprocal",
        param: null,
        expect: "-74.0"
    }, {
        label: "reciprocal",
        set: 1 / 2,
        fn: "reciprocal",
        param: null,
        expect: "2.0"
    }, {
        label: "abs(-222/3)",
        set: {
            n: -222,
            d: 3
        },
        fn: "abs",
        param: null,
        expect: "74.0"
    }, {
        label: "9 % -2",
        set: '9',
        fn: "mod",
        param: "-2",
        expect: "1.0"
    }, {
        label: "-9 % 2",
        set: '-9',
        fn: "mod",
        param: "-2",
        expect: "-1.0"
    }, {
        label: "10 / 0",
        set: 10,
        fn: "div",
        param: 0,
        expect: "DIV/0"
    }, {
        label: "-3 / 4",
        set: [-3, 4],
        fn: "reciprocal",
        param: null,
        expect: "-1.(3)"
    }, {
        label: "-19.6",
        set: [-98, 5],
        fn: "equals",
        param: '-19.6',
        expect: "true" // actually, we get a real bool but we call toString() in the test below
    }, {
        label: "-19.6",
        set: [98, -5],
        fn: "equals",
        param: '-19.6',
        expect: "true"
    }, {
        label: "99/88",
        set: [99, 88],
        fn: "equals",
        param: [88, 99],
        expect: "false"
    }, {
        label: "99/88",
        set: [99, -88],
        fn: "equals",
        param: [9, 8],
        expect: "false"
    }, {
        label: "12.5",
        set: 12.5,
        fn: "add",
        param: 0,
        expect: "12.5"
    }, {
        label: "0/1 -> 1/0",
        set: 0,
        fn: "reciprocal",
        param: null,
        expect: "DIV/0"
    }, {
        label: "abs(-100.25)",
        set: '-100.25',
        fn: "abs",
        param: null,
        expect: "100.25"
    }, {
        label: "0.022222222",
        set: '0.0(22222222)',
        fn: "abs",
        param: null,
        expect: "0.0(2)"
    }, {
        label: "1.5 | 100.6",
        set: '100.5',
        fn: "divisible",
        param: '1.5',
        expect: "true"
    }, {
        label: "1.5 | 100.6",
        set: '100.6',
        fn: "divisible",
        param: '1.6',
        expect: "false"
    }, {
        label: "(1/6) | (2/3)", // == 4
        set: [2, 3],
        fn: "divisible",
        param: [1, 6],
        expect: "true"
    }, {
        label: "(1/6) | (2/5)",
        set: [2, 5],
        fn: "divisible",
        param: [1, 6],
        expect: "false"
    }, {
        label: "fmod(4.55, 0.05)", // http://phpjs.org/functions/fmod/ (comment section)
        set: "4.55",
        fn: "mod",
        param: "0.05",
        expect: "0.0"
    }, {
        label: "fmod(99.12, 0.4)",
        set: "99.12",
        fn: "mod",
        param: "0.4",
        expect: "0.32"
    }, {
        label: "fmod(fmod(1.0,0.1))", // http://stackoverflow.com/questions/4218961/why-fmod1-0-0-1-1
        set: "1.0",
        fn: "mod",
        param: "0.1",
        expect: "0.0"
    }];

describe('Fraction', function() {

    for (var i = 0; i < tests.length; i++) {

        (function(i) {

            if (tests[i].fn) {

                it(tests[i].label, function() {
                    try {
                        assert.equal(tests[i].expect, fraction.set(tests[i].set)[tests[i].fn](tests[i].param).toString());
                    } catch (e) {
                        assert.equal(e.toString(), tests[i].expect.toString());
                    }
                });

            } else {

                it(tests[i].label, function() {
                    try {
                        assert.equal(tests[i].expect, fraction.set(tests[i].set).toString());
                    } catch (e) {
                        assert.equal(e.toString(), tests[i].expect.toString());
                    }
                });
            }

        })(i);
    }
});

describe('JSON', function() {

    it("Should be possible to stringify the object", function() {

        fraction.set("44.3(12)");

        assert.equal('{"n":14623,"s":1,"d":330}', JSON.stringify(fraction));

        fraction.set(-1 / 2).reciprocal();

        assert.equal('{"n":2,"s":-1,"d":1}', JSON.stringify(fraction));

    });
});

describe('Arguments', function() {

    it("Should be possible to use different kind of params", function() {

        // String
        fraction.set("0.1");
        assert.equal("1/10", fraction.n + "/" + fraction.d);

        // Two params
        fraction.set(1, 2);
        assert.equal("1/2", fraction.n + "/" + fraction.d);

        // Object
        fraction.set({n: 1, d: 3});
        assert.equal("1/3", fraction.n + "/" + fraction.d);

        // Array
        fraction.set([1, 4]);
        assert.equal("1/4", fraction.n + "/" + fraction.d);
    });
});

describe('fractions', function() {

    it("Should pass 0.08 = 2/25", function() {

        fraction.set("0.08");
        assert.equal("2/25", fraction.n + "/" + fraction.d);

        fraction.set("0.200");
        assert.equal("1/5", fraction.n + "/" + fraction.d);

        fraction.set("0.125");
        assert.equal("1/8", fraction.n + "/" + fraction.d);
    });
});
