import { SubstrateEvent } from '@subql/types'
import { MOVRTransfer } from '../../types'
import { ensureBlock } from '../block'
import { ensureExtrinsic } from '../extrinsic'
import { ensureAccount } from '../account'


export async function ensureTransfer(event: SubstrateEvent) {
	const block = await ensureBlock(event.block)
	const extrinsic = await ensureExtrinsic(event.extrinsic)
	const idx = event.idx
	const recordId = `${block.id}-${idx}`
	let data = await MOVRTransfer.get(recordId)
	if (!data) {
		data = new MOVRTransfer(recordId)
		data.index = idx
		data.blockId = block.id
		data.extrinsicId = extrinsic.id
		await data.save()
	}
	return data
}

export async function createTransfer(event: SubstrateEvent) {
	const data = await ensureTransfer(event)
	const from = await ensureAccount(event.event.data[0].toString())
	const to = await ensureAccount(event.event.data[1].toString())
	
	data.fromId = from.id
	data.toId = to.id
	// Would probably need to divide by decimal here
	data.value = event.event.data[2].toString()

	await data.save()
	return data
}
