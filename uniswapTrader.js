const { ethers } = require('ethers')
const {
  abi: IUniswapV3PoolABI,
} = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const {
  abi: SwapRouterABI,
} = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')
const {
  getPoolImmutables,
  getPoolAddress,
  getWalletBalances,
} = require('./helpers')
const { swapRouterAddress, TokenFrom } = require('./lib/constants')
const ERC20ABI = require('./abi.json')

require('dotenv').config()

const INFURA_URL_TESTNET = process.env.INFURA_URL_TESTNET
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET) // Celo Alfajores

async function main(inputAmount) {
  const amountIn = ethers.utils.parseUnits(inputAmount.toString(), 18)

  const poolContract = new ethers.Contract(
    getPoolAddress(),
    IUniswapV3PoolABI,
    provider
  )

  const immutables = await getPoolImmutables(poolContract)

  const wallet = new ethers.Wallet(WALLET_SECRET)
  const connectedWallet = wallet.connect(provider)

  const swapRouterContract = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI,
    provider
  )

  await approveTransfer(amountIn, connectedWallet)

  const params = {
    tokenIn: immutables.token1,
    tokenOut: immutables.token0,
    fee: immutables.fee,
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  }

  console.log('Wallet balances before:')
  await getWalletBalances(provider, WALLET_ADDRESS)

  console.log('====================================')

  const transaction = swapRouterContract
    .connect(connectedWallet)
    .exactInputSingle(params, {
      gasLimit: ethers.utils.hexlify(1000000),
    })
    .then(async (transaction) => {
      console.log('Wallet balances After:')
      await getWalletBalances(provider, WALLET_ADDRESS)

      console.log('====================================')

      console.log(transaction)
    })
    .catch((err) => {
      console.log('Failed send transaction', err)
    })
}

const approveTransfer = async (amountIn, userWallet) => {
  console.log('Approving transfer....')
  console.log('----------------------------------------')

  try {
    const approvalAmount = (amountIn * 100000).toString()

    const tokenFromContract = new ethers.Contract(
      TokenFrom.address,
      ERC20ABI,
      provider
    )

    await tokenFromContract
      .connect(userWallet)
      .approve(swapRouterAddress, approvalAmount)

    console.log('Approve Transfer Success! ')
  } catch (error) {
    console.log('Approve transfer failed!', error)
  }
}

const amount = 0.001

main(amount)
