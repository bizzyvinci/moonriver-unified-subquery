import { MoonbeamCall } from '@subql/contract-processors/dist/moonbeam'
import { ensureBlock } from './block'
import { Transaction } from '../types'


export async function ensureTransaction(hash: string) {
	let data = await Transaction.get(hash)
	if (!data) {
		data = new Transaction(hash)
		await data.save()
	}
	return data
}

export async function createTransaction(call: MoonbeamCall) {
	const data = await ensureTransaction(call.hash)
	const block = await ensureBlock(call.blockNumber.toString())

	data.blockId = block.id
	data.from = call.from.toString()
	data.to = call.to?.toString()
	data.success = call.success
	
	data.value = call.value?.toBigInt()
	data.nonce = call.nonce
	data.gasLimit = call.gasLimit?.toBigInt()
	data.gasPrice = call.gasPrice?.toBigInt()
	data.maxFeePerGas = call.maxFeePerGas?.toBigInt()
	data.type = call.type
	data.data = call.data.toString()
	// lazy method
	data.arguments = call.args?.toString()
}
