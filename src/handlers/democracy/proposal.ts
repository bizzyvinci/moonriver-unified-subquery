import { SubstrateEvent } from '@subql/types';
import { Proposal } from '../../types'
import { getTimeline } from '.'


export async function ensureProposal(propIndex: string) {
	let data = Proposal.get(propIndex)
	if (!data) {
		const data = new Proposal(propIndex)
		await data.save()
	}
	return data
}

export async function createProposal(event: SubstrateEvent) {
	const [propIndex, deposit] = event.event.data.toJSON() as [string, string]
	const data = await ensureProposal(propIndex)
	data.deposit = BigInt(deposit)
	data.author = event.extrinsic.extrinsic.signer.toString()
	data.preimage = event.extrinsic.extrinsic.args[0].toString()
	data.timeline = [getTimeline(event)]
	
	await data.save()
	return data
}

export async function updateProposal(event: SubstrateEvent) {
	const data = await ensureProposal(event.event.data[0].toString())
	data.timeline.push(getTimeline(event))
	await data.save()
	return data
}
