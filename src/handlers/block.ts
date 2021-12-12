import { SubstrateBlock } from '@subql/types'
import { Block } from '../types'


export async function ensureBlock(recordId: string) {
	let data = await Block.get(recordId)
	if (!data) {
		data = new Block(recordId)
		await data.save()
	}
	return data
}

export async function createBlock(block: SubstrateBlock) {
	const data = await ensureBlock(block.block.header.number.toString())
	
	data.hash = block.block.hash?.toString()
	data.timestamp = block.timestamp //.toDate?
	data.parentHash = block.block.header.parentHash?.toString()
	data.specVersion = block.specVersion?.toString()
	data.stateRoot = block.block.header.stateRoot?.toString()
	data.extrinsicsRoot = block.block.header.extrinsicsRoot?.toString()
	// This is probably not the block size but variable size
	data.size = block.block.size

	await data.save()
	return data
}