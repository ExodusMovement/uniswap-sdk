import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import _Big, { RoundingMode } from 'big.js'
import toFormat from 'toformat'

import { BigintIsh, Rounding } from '../../constants'
import { ONE } from '../../constants'
import { parseBigintIsh } from '../../utils'

const Big = toFormat(_Big)

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: RoundingMode.RoundDown,
  [Rounding.ROUND_HALF_UP]: RoundingMode.RoundHalfUp,
  [Rounding.ROUND_UP]: RoundingMode.RoundUp
}

export class Fraction {
  public readonly numerator: JSBI
  public readonly denominator: JSBI

  constructor(numerator: BigintIsh, denominator: BigintIsh = ONE) {
    this.numerator = parseBigintIsh(numerator)
    this.denominator = parseBigintIsh(denominator)
  }

  // performs floor division
  get quotient(): JSBI {
    return JSBI.divide(this.numerator, this.denominator)
  }

  // remainder after floor division
  get remainder(): Fraction {
    return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator)
  }

  invert(): Fraction {
    return new Fraction(this.denominator, this.numerator)
  }

  add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator)
    }
    return new Fraction(
      JSBI.add(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator)
    }
    return new Fraction(
      JSBI.subtract(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return JSBI.lessThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return JSBI.equal(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return JSBI.greaterThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.numerator),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(this.denominator, otherParsed.numerator)
    )
  }

  toFixed(
    decimalPlaces: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`)
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)

    Big.DP = decimalPlaces
    Big.RM = toFixedRounding[rounding]
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format)
  }
}
