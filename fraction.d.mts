/**
 * Interface representing a fraction with numerator and denominator.
 */
export interface NumeratorDenominator {
    n: number | bigint;
    d: number | bigint;
}

/**
 * Type for handling multiple types of input for Fraction operations.
 */
export type FractionInput =
    | Fraction
    | number
    | string
    | [number | string, number | string]
    | NumeratorDenominator;

/**
 * Function signature for Fraction operations like add, sub, mul, etc.
 */
export type FractionParam = {
    (fraction: Fraction): Fraction;
    (num: number | bigint | string): Fraction;
    (numerator: number | bigint, denominator: number | bigint): Fraction;
    (numbers: [number | bigint | string, number | bigint | string]): Fraction;
    (fraction: NumeratorDenominator): Fraction;
    (firstValue: FractionInput): Fraction;
};

/**
 * Fraction class representing a rational number with numerator and denominator.
 */
class Fraction {
    constructor(fraction: Fraction);
    constructor(num: number | bigint | string);
    constructor(numerator: number | bigint, denominator: number | bigint);
    constructor(numbers: [number | bigint | string, number | bigint | string]);
    constructor(fraction: NumeratorDenominator);
    constructor(firstValue: FractionInput, secondValue?: number);

    s: bigint;
    n: bigint;
    d: bigint;

    abs(): Fraction;
    neg(): Fraction;

    add: FractionParam;
    sub: FractionParam;
    mul: FractionParam;
    div: FractionParam;
    pow: FractionParam;
    log: FractionParam;
    gcd: FractionParam;
    lcm: FractionParam;

    mod(n?: number | bigint | string | Fraction): Fraction;

    ceil(places?: number): Fraction;
    floor(places?: number): Fraction;
    round(places?: number): Fraction;
    roundTo: FractionParam;

    inverse(): Fraction;
    simplify(eps?: number): Fraction;

    equals(n: number | bigint | string | Fraction): boolean;
    lt(n: number | bigint | string | Fraction): boolean;
    lte(n: number | bigint | string | Fraction): boolean;
    gt(n: number | bigint | string | Fraction): boolean;
    gte(n: number | bigint | string | Fraction): boolean;
    compare(n: number | bigint | string | Fraction): number;
    divisible(n: number | bigint | string | Fraction): boolean;

    valueOf(): number;
    toString(decimalPlaces?: number): string;
    toLatex(showMixed?: boolean): string;
    toFraction(showMixed?: boolean): string;
    toContinued(): bigint[];
    clone(): Fraction;
}

export { Fraction as default, Fraction };