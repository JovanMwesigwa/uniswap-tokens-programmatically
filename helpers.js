const {
  uniswapV3FactoryAddress,
  TokenFrom,
  TokenTo,
} = require('./lib/constants')
const { computePoolAddress } = require('@uniswap/v3-sdk')
const { Config } = require('./config')
const { ethers } = require('ethers')
const ERC20ABI = require('./abi.json')

exports.getPoolImmutables = async (poolContract) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ])

  const immutables = {
    token0: token0,
    token1: token1,
    fee: fee,
  }
  return immutables
}

exports.getPoolAddress = async () => {
  const poolAddress = computePoolAddress({
    factoryAddress: uniswapV3FactoryAddress,
    tokenA: Config.tokens.in,
    tokenB: Config.tokens.out,
    fee: Config.tokens.poolFee,
  })
  return poolAddress
}

exports.getWalletBalances = async (provider, address) => {
  // Find the balance of CELO token before
  const CeloContract = new ethers.Contract(
    TokenFrom.address,
    ERC20ABI,
    provider
  )

  const CeloDolarContract = new ethers.Contract(
    TokenTo.address,
    ERC20ABI,
    provider
  )

  const celoBalance = await CeloContract.balanceOf(address)

  const cUsdBalance = await CeloDolarContract.balanceOf(address)

  console.log('Balances: ')
  console.log('CELO: ', celoBalance.toString())
  console.log('cUSD: ', cUsdBalance.toString())
}
