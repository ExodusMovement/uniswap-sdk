import invariant from 'tiny-invariant'
import JSBI from 'jsbi'

import { ChainId, SolidityType } from '../constants'
import { validateAndParseAddress, validateSolidityTypeInstance } from '../utils'

export class Token {
  public readonly chainId: ChainId
  public readonly address: string
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

    this.chainId = chainId
    this.address = validateAndParseAddress(address)
    this.decimals = decimals
    if (typeof symbol === 'string') this.symbol = symbol
    if (typeof name === 'string') this.name = name
  }

  equals(other: Token): boolean {
    const equal = this.chainId === other.chainId && this.address === other.address
    if (equal) {
      invariant(this.decimals === other.decimals, 'DECIMALS')
      if (this.symbol && other.symbol) invariant(this.symbol === other.symbol, 'SYMBOL')
      if (this.name && other.name) invariant(this.name === other.name, 'NAME')
    }
    return equal
  }

  sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

export const WETH = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether')
}
