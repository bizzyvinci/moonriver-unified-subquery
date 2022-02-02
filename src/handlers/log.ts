import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam'
import { ensureBlock } from './block'
import { ensureTransaction } from './transaction'
import { ensureDay } from './day'
import { Log } from '../types'
import { createErc20Transfer, createErc721Transfer, linkContract } from './ethereum'


export async function ensureLog(event: MoonbeamEvent) {
  const transaction = await ensureTransaction(event.transactionHash,
    event.blockNumber.toString())
  const transactionIndex = event.transactionIndex
  const logIndex = event.logIndex
  
  const recordId = `${transaction.id}-${logIndex}`
  let data = await Log.get(recordId)

  if (!data) {
    data = new Log(recordId)
    data.transactionId = transaction.id
    data.transactionIndex = transactionIndex
    data.logIndex = logIndex
    await data.save()
  }
  return data
}

export async function createLog(event: MoonbeamEvent) {
  const data = await ensureLog(event)
  const block = await ensureBlock(event.blockNumber.toString())

  data.blockId = block.id
  data.timestamp = event.blockTimestamp
  // null address probably means internalTransaction
  data.address = event.address.toString()
  data.data = event.data.toString()
  
  // lazy method
  data.topics = event.topics.toString()
  data.arguments = event.args?.toString()
  
  data.removed = event.removed

  
  const day = await ensureDay(event.blockTimestamp)
  
  switch(event.topics[0]) {
    // Transfer
    case "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": {
      if (event.topics.length === 3) {
        await createErc20Transfer(event, data)
        day.erc20TransferCounts += BigInt(1)
      } else if (event.topics.length === 4) {
        await createErc721Transfer(event, data)
        day.erc721TransferCounts += BigInt(1)
      }
      break
    }

    // OwnershipTransferred
    case "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
      // Contract Creation
      if (event.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        await linkContract(event)
        day.newContracts += BigInt(1)
      }
    }
  }

  await day.save()
  await data.save()
  
  return data
}
