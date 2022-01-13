import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam'
import { ensureAccount } from '../account'
import { Erc20Token, Erc20Balance, Erc20Transfer, Log} from '../../types'


const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export async function createErc20Transfer(event: MoonbeamEvent, log: Log) {
  // create Transfer, Edit Balance, 
  const token = await ensureToken(event.address)
  const from = await ensureAccount(`0x${event.topics[1].slice(-40)}`)
  const to = await ensureAccount(`0x${event.topics[2].slice(-40)}`)
  const value = BigInt(event.data)

  const transfer = Erc20Transfer.create({
    id: log.id,
    fromId: from.id,
    toId: to.id,
    tokenId: token.id,
    value: value,
    transactionHash: log.transactionId,
    transactionIndex: log.transactionIndex,
    blockNumber: BigInt(log.blockId),
    timestamp: log.timestamp
  })

  await transfer.save()

  // Minting and Burning
  if (from.id === NULL_ADDRESS) {
    token.supply += value
  } else if (to.id === NULL_ADDRESS) {
    token.supply -= value
  }
  await token.save()

  // Edit Balance
  const toBalance = await ensureBalance(token.id, to.id)
  toBalance.value += value
  await toBalance.save()

  if (from.id != NULL_ADDRESS) {
    const fromBalance = await ensureBalance(token.id, from.id)
    fromBalance.value -= value
    await fromBalance.save()
  }
}


async function ensureToken(address: string) {
  let data = await Erc20Token.get(address)
  if (!data) {
    data = Erc20Token.create({
      id: address,
      supply: BigInt(0)
    })
    await data.save()
  }
  return data
}


async function ensureBalance(tokenId: string, accountId: string) {
  const recordId = `${tokenId}-${accountId}`
  let data = await Erc20Balance.get(recordId)
  if (!data) {
    data = Erc20Balance.create({
      id: recordId,
      tokenId: tokenId,
      accountId: accountId,
      value: BigInt(0)
    })
    await data.save()
  }
  return data
}
