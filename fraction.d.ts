declare module 'fraction.js';

export interface NumeratorDenominator {
  numerator: number;
  denominator: number;
}

export default class Fraction {
  constructor (num: number | string);
  constructor (numerator: number, denominator: number);
  constructor (numbers: (number | string)[]);
  constructor (fraction: NumeratorDenominator);

  abs(): Fraction;
  neg(): Fraction;

  add(n: number | string | Fraction): Fraction;
  sub(n: number | string | Fraction): Fraction;
  mul(n: number | string | Fraction): Fraction;
  div(n: number | string | Fraction): Fraction;
  pow(n: number | string | Fraction): Fraction;
  mod(n?: number | string | Fraction): Fraction;
  gcd(n: number | string | Fraction): Fraction;
  lcm(n: number | string | Fraction): Fraction;

  ceil(places?: number): Fraction;
  floor(places?: number): Fraction;
  round(places?: number): Fraction;

  inverse(): Fraction;
  
  simmplify(eps?: number): Fraction;
  
  equals(n: number | string | Fraction): boolean;
  compare(n: number | string | Fraction): number;
  divisible(n: number | string | Fraction): boolean;
  
  valueOf(): number;
  toString(decimalPlaces?: number): string;
  toLatex(excludeWhole?: boolean): string;
  toFraction(excludeWhole?: boolean): string;
  toContinued(): number[];
  clone(): Fraction;
}
