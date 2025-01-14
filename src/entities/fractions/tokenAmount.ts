import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'

import { BigintIsh, Rounding, TEN, SolidityType } from '../../constants'
import { parseBigintIsh, validateSolidityTypeInstance } from '../../utils'
import { Token } from '../token'
import { Fraction } from './fraction'

const Big = toFormat(_Big)

export class TokenAmount extends Fraction {
  public readonly token: Token

  // amount _must_ be raw, i.e. in the native representation
  constructor(token: Token, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(token.decimals)))
    this.token = token
  }

  get raw(): JSBI {
    return this.numerator
  }

  add(other: TokenAmount): TokenAmount {
    invariant(this.token.equals(other.token), 'TOKEN')
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw))
  }

  subtract(other: TokenAmount): TokenAmount {
    invariant(this.token.equals(other.token), 'TOKEN')
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw))
  }

  toFixed(
    decimalPlaces: number = this.token.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.token.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.token.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }
}
