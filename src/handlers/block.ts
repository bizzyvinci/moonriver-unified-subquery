import { SubstrateBlock } from '@subql/types'
import { Block } from '../types'


export async function ensureBlock(block: SubstrateBlock) {
	const recordId = block.block.header.number.toString()
	let data = await Block.get(recordId)
	if (!data) {
		data = new Block(recordId)
		await data.save()
	}
	return data
}

export async function createBlock(origin: SubstrateBlock) {
	const data = await ensureBlock(origin)
	
	data.hash = origin.block.hash?.toString()
	data.timestamp = origin.timestamp //.toDate?
	data.parentHash = origin.block.header.parentHash?.toString()
	data.specVersion = origin.specVersion?.toString()
	data.stateRoot = origin.block.header.stateRoot?.toString()
	data.extrinsicsRoot = origin.block.header.extrinsicsRoot?.toString()
	// This is probably not the block size but variable size
	data.size = origin.block.size

	await data.save()
	return data
}
