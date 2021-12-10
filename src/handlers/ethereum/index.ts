import { SubstrateEvent } from '@subql/types'
import { Transaction } from '../../types'
import { ensureExtrinsic } from '../extrinsic'
import { ensureTransaction } from '../transaction'
//import { createToken } from './token'

export async function createEthereum(event: SubstrateEvent) {
	if (event.event.section === 'Executed') {
		// Link transaction hash to extrinsic
		const transactionHash = event.event.data[2].toString()
		const transaction = await ensureTransaction(transactionHash)
		const extrinsic = await ensureExtrinsic(event.extrinsic)
		extrinsic.transactionId = transaction.id
		extrinsic.save()
	}
}
