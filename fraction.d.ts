/**
 * CommonJS type definitions for Fraction.
 */

declare class Fraction {
  constructor();
  constructor(num: Fraction.FractionInput);
  constructor(numerator: number | bigint, denominator: number | bigint);

  s: bigint;
  n: bigint;
  d: bigint;

  abs(): Fraction;
  neg(): Fraction;

  add: Fraction.FractionParam;
  sub: Fraction.FractionParam;
  mul: Fraction.FractionParam;
  div: Fraction.FractionParam;
  pow: Fraction.FractionParam;
  log: Fraction.FractionParam;
  gcd: Fraction.FractionParam;
  lcm: Fraction.FractionParam;

  mod(): Fraction;
  mod(num: Fraction.FractionInput): Fraction;

  ceil(places?: number): Fraction;
  floor(places?: number): Fraction;
  round(places?: number): Fraction;
  roundTo: Fraction.FractionParam;

  inverse(): Fraction;
  simplify(eps?: number): Fraction;

  equals(num: Fraction.FractionInput): boolean;
  lt(num: Fraction.FractionInput): boolean;
  lte(num: Fraction.FractionInput): boolean;
  gt(num: Fraction.FractionInput): boolean;
  gte(num: Fraction.FractionInput): boolean;
  compare(num: Fraction.FractionInput): number;
  divisible(num: Fraction.FractionInput): boolean;

  valueOf(): number;
  toString(decimalPlaces?: number): string;
  toLatex(showMixed?: boolean): string;
  toFraction(showMixed?: boolean): string;
  toContinued(): bigint[];
  clone(): Fraction;

  static Fraction: typeof Fraction;
  static default: typeof Fraction;
}

declare namespace Fraction {
  /**
   * Interface representing a fraction with numerator and denominator.
   */
  interface NumeratorDenominator {
    n: number | bigint;
    d: number | bigint;
  }

  /**
   * Type for handling multiple types of input for Fraction operations.
   */
  type FractionInput =
    | Fraction
    | number
    | bigint
    | string
    | [number | bigint | string, number | bigint | string]
    | NumeratorDenominator;

  /**
   * Function signature for Fraction operations like add, sub, mul, etc.
   */
  type FractionParam = {
    (numerator: number | bigint, denominator: number | bigint): Fraction;
    (num: FractionInput): Fraction;
  };
}

export = Fraction;