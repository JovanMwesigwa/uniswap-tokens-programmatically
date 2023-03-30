const { Token, SupportedChainId } = require('@uniswap/sdk-core')

const swapRouterAddress = '0x5615CDAb10dc425a742d643d949a7F474C01abc4'
const uniswapV3FactoryAddress = '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc'

const TokenFrom = {
  name: 'Celo',
  symbol: 'CELO',
  decimals: 18,
  address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
}

const TokenTo = {
  name: 'Celo Dollar',
  symbol: 'cUSD',
  decimals: 18,
  address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
}

const CELO_TOKEN = new Token(
  SupportedChainId.CELO_ALFAJORES,
  TokenFrom.address,
  TokenFrom.decimals,
  TokenFrom.symbol,
  TokenFrom.name
)

const CELO_DOLLAR = new Token(
  SupportedChainId.CELO_ALFAJORES,
  TokenTo.address,
  TokenTo.decimals,
  TokenTo.symbol,
  TokenTo.name
)

module.exports = {
  swapRouterAddress,
  uniswapV3FactoryAddress,
  CELO_TOKEN,
  CELO_DOLLAR,
  TokenFrom,
  TokenTo,
}
