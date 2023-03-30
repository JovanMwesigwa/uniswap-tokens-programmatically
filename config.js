const { FeeAmount } = require('@uniswap/v3-sdk')
const { CELO_DOLLAR, CELO_TOKEN } = require('./lib/constants')

// Configuration template
const Config = {
  tokens: {
    in: CELO_DOLLAR,
    amountIn: 1000,
    out: CELO_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
}

module.exports = {
  Config,
}
