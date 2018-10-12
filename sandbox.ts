import * as Fraction  from './fraction';

const n: Fraction = new Fraction(1, 3);
//console.log(n.toFraction());
console.log(n.add(2.5).toFraction(true));

const f: Fraction = new Fraction(1,3);
console.log(f.toFraction());
