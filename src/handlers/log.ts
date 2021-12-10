import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam'
import { Log } from '../types'


export async function ensureLog(event: MoonbeamEvent) {
	const transactionHash = event.transactionHash
	const transactionIndex = event.transactionIndex
	const logIndex = event.logIndex
	
	const recordId = `${transactionHash}-${logIndex}`
	let data = await Log.get(recordId)

	if (!data) {
		data = new Log(recordId)
		data.transactionId = transactionHash
		data.transactionIndex = transactionIndex
		data.logIndex = logIndex
		await data.save()
	}
	return data
}

export async function createLog(event: MoonbeamEvent) {
	const data = await ensureLog(event)
	
	data.blockId = event.blockNumber.toString()
	data.index = event.transactionIndex
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
