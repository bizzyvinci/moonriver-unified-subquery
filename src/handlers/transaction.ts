import { MoonbeamCall } from '@subql/contract-processors/dist/moonbeam'
import { ensureBlock } from './block'
import { Transaction } from '../types'
import { ensureAccount } from './account'


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
	const from = await ensureAccount(call.from.toString())
	const to = call.to ? await ensureAccount(call.to.toString()) : null

	data.blockId = block.id
	data.fromId = from.id
	data.toId = to ? to.id : null
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
