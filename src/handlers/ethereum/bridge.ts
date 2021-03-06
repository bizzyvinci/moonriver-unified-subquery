import { SubstrateEvent } from '@subql/types'
import { ensureExtrinsic } from '../extrinsic'
import { ensureTransaction } from '../transaction'

export async function linkTransaction(event: SubstrateEvent) {
  if (event.event.method === 'Executed' && event.extrinsic) {
    // Link extrinsicId to transaction
    const transactionHash = event.event.data[2].toString()
    const transaction = await ensureTransaction(transactionHash, 
      event.block.block.header.number.toString())
    const extrinsic = await ensureExtrinsic(event.extrinsic)
    transaction.extrinsicId = extrinsic.id
    transaction.extrinsicIndex = extrinsic.index
    
    await transaction.save()
  }
}
