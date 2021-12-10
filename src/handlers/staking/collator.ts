import { SubstrateEvent } from '@subql/types'
import { Collator } from '../../types'
import { ensureExtrinsic } from '../extrinsic'


export async function ensureCollator(event: SubstrateEvent) {
	const recordId = event.event.meta.args[0].toString()
	let data = await Collator.get(recordId)
	if (!data) {
		data = new Collator(recordId)
		const extrinsic = await ensureExtrinsic(event.extrinsic)
		data.joinedExtrinsicId = extrinsic.id
		await data.save()
	}
	return data
}

export async function activateCollator(event: SubstrateEvent) {
	const data = await ensureCollator(event)
	data.active = true
	await data.save()
	return data
}

export async function deactivateCollator(event: SubstrateEvent) {
	const data = await ensureCollator(event)
	data.active = false
	await data.save()
	return data
}