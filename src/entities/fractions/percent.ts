import { Rounding, _100 } from '../../constants'
import { Fraction } from './fraction'

const _100_PERCENT = new Fraction(_100)

export class Percent extends Fraction {
  toFixed(decimalPlaces: number = 2, format?: object, rounding?: Rounding): string {
    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding)
  }
}
