import { SubstrateEvent } from '@subql/types'
import { Event } from '../types'
import { ensureBlock } from './block'
import { ensureExtrinsic } from './extrinsic'
import { createStaking } from './staking'
import { createBalances } from './balances'
import { linkTransaction } from './ethereum'
//import { createDemocracy } from './democracy'


export async function ensureEvent(event: SubstrateEvent) {
	const block = await ensureBlock(event.block.block.header.number.toString())
	const idx = event.idx
	const recordId = `${block.id}-${idx}`
	let data = await Event.get(recordId)
	if (!data) {
		data = new Event(recordId)
		data.index = idx
		data.blockId = block.id
		data.timestamp = block.timestamp
		await data.save()
	}
	return data
}

export async function createEvent(event: SubstrateEvent) {
	const data = await ensureEvent(event)
	data.section = event.event.section
	data.method = event.event.method
	// lazy method
	data.docs = event.event.meta.docs.toString()
	data.arguments = event.event.meta.args.toString()
	data.data = event.event.data.toString()

	const extrinsic = await (event.extrinsic
		? ensureExtrinsic(event.extrinsic)
		: undefined)
	if (extrinsic) {
		data.extrinsicId = extrinsic.id
	}

	await data.save()

	if (data.section === 'parachainStaking') {
		await createStaking(event)
	} else if (data.section === 'balances') {
		await createBalances(event)
	} else if (data.section === 'ethereum') {
		await linkTransaction(event)
	} else if (data.section === 'democracy') {
		//await createDemocracy(event)
	}

	return data
}
