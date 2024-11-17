declare module 'Fraction';

/**
 * Interface representing a fraction with numerator and denominator.
 */
export interface NumeratorDenominator {
  n: number | bigint;
  d: number | bigint;
}

/**
 * Type for handling multiple types of input for Fraction operations.
 * Allows passing fractions, numbers, strings, or objects containing
 * a numerator and denominator.
 */
type FractionInput = Fraction | number | string | [number | string, number | string] | NumeratorDenominator;

/**
 * Function signature for Fraction operations like add, sub, mul, etc.
 * Accepts various types of inputs and returns a Fraction.
 */
type FractionParam = {
  (fraction: Fraction): Fraction;
  (num: number | bigint | string): Fraction;
  (numerator: number | bigint, denominator: number | bigint): Fraction;
  (numbers: [number | bigint | string, number | bigint | string]): Fraction;
  (fraction: NumeratorDenominator): Fraction;
  (firstValue: FractionInput): Fraction;
};

/**
 * Fraction class representing a rational number with numerator and denominator.
 * Supports arithmetic, comparison, and formatting operations.
 */
export class Fraction {
  /**
   * Constructs a new Fraction instance.
   * Can accept another Fraction, a number, a string, a tuple, or an object with numerator and denominator.
   */
  constructor(fraction: Fraction);
  constructor(num: number | bigint | string);
  constructor(numerator: number | bigint, denominator: number | bigint);
  constructor(numbers: [number | bigint | string, number | bigint | string]);
  constructor(fraction: NumeratorDenominator);
  constructor(firstValue: FractionInput, secondValue?: number);

  /** The sign of the fraction (-1 or 1) */
  s: bigint;
  /** The numerator of the fraction */
  n: bigint;
  /** The denominator of the fraction */
  d: bigint;

  /** Returns the absolute value of the fraction */
  abs(): Fraction;

  /** Negates the fraction */
  neg(): Fraction;

  /** Adds a fraction or number */
  add: FractionParam;

  /** Subtracts a fraction or number */
  sub: FractionParam;

  /** Multiplies by a fraction or number */
  mul: FractionParam;

  /** Divides by a fraction or number */
  div: FractionParam;

  /** Raises the fraction to a given power */
  pow: FractionParam;

  /** Calculates the logarithm of a fraction to a given rational base */
  log: FractionParam;

  /** Finds the greatest common divisor (gcd) with another fraction or number */
  gcd: FractionParam;

  /** Finds the least common multiple (lcm) with another fraction or number */
  lcm: FractionParam;

  /**
   * Returns the modulo of the fraction with respect to another fraction or number.
   * If no argument is passed, it returns the fraction modulo 1.
   */
  mod(n?: number | bigint | string | Fraction): Fraction;

  /** Rounds the fraction up to the nearest integer, optionally specifying the number of decimal places */
  ceil(places?: number): Fraction;

  /** Rounds the fraction down to the nearest integer, optionally specifying the number of decimal places */
  floor(places?: number): Fraction;

  /** Rounds the fraction to the nearest integer, optionally specifying the number of decimal places */
  round(places?: number): Fraction;

  /** Rounds the fraction to the nearest multiple of another fraction or number */
  roundTo: FractionParam;

  /** Returns the inverse of the fraction (numerator and denominator swapped) */
  inverse(): Fraction;

  /**
   * Simplifies the fraction to its simplest form.
   * Optionally accepts an epsilon value for controlling precision in approximation.
   */
  simplify(eps?: number): Fraction;

  /** Checks if two fractions or numbers are equal */
  equals(n: number | bigint | string | Fraction): boolean;

  /** Check if this rational number is less than another */
  lt(n: number | bigint | string | Fraction): boolean;

  /** Check if this rational number is less than or equal another */
  lte(n: number | bigint | string | Fraction): boolean;

  /** Check if this rational number is greater than another */
  gt(n: number | bigint | string | Fraction): boolean;

  /** Check if this rational number is greater than or equal another */
  gte(n: number | bigint | string | Fraction): boolean;

  /** Compares two fractions or numbers. Returns -1, 0, or 1 based on the comparison. */
  compare(n: number | bigint | string | Fraction): number;

  /** Checks if the fraction is divisible by another fraction or number */
  divisible(n: number | bigint | string | Fraction): boolean;

  /** Returns the decimal representation of the fraction */
  valueOf(): number;

  /**
   * Returns a string representation of the fraction.
   * Optionally specifies the number of decimal places.
   */
  toString(decimalPlaces?: number): string;

  /**
   * Returns a LaTeX string representing the fraction.
   * Optionally excludes the whole part in the LaTeX string.
   */
  toLatex(showMixed?: boolean): string;

  /**
   * Returns a string representing the fraction in fraction format.
   * Optionally excludes the whole part of the fraction.
   */
  toFraction(showMixed?: boolean): string;

  /** Returns an array representing the continued fraction form of the fraction */
  toContinued(): bigint[];

  /** Returns a clone of the current fraction */
  clone(): Fraction;
}

export default Fraction;