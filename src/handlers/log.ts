import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam'
import { ensureBlock } from './block'
import { ensureTransaction } from './transaction'
import { Log } from '../types'


export async function ensureLog(event: MoonbeamEvent) {
	const transaction = await ensureTransaction(event.transactionHash)
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
	data.arguments = event.args.toString()
	
	data.removed = event.removed

	await data.save()
	return data
}
