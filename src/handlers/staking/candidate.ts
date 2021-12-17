import { SubstrateEvent } from '@subql/types'
import { Candidate } from '../../types'
import { ensureExtrinsic } from '../extrinsic'
import { removeAllDelegations } from './delegate'


export async function ensureCandidate(recordId: string) {
	let data = await Candidate.get(recordId)
	if (!data) {
		data = new Candidate(recordId)
		await data.save()
	}
	return data
}

export async function createCandidate(event: SubstrateEvent) {
	const data = await ensureCandidate(event.event.data[0].toString())
	const extrinsic = await ensureExtrinsic(event.extrinsic)

	data.selfBonded = BigInt(event.event.data[1].toString())
	data.joinedExtrinsicId = extrinsic.id
	await data.save()
	return data
}

export async function chooseCandidate(event: SubstrateEvent) {
	const data = await ensureCandidate(event.event.data[1].toString())
	data.isChosen = true
	await data.save()
	return data
}

export async function changeSelfBonded(event: SubstrateEvent) {
	const data = await ensureCandidate(event.event.data[0].toString())
	data.selfBonded = BigInt(event.event.data[2].toString())
	await data.save()
	return data
}

export async function removeCandidate(event: SubstrateEvent) {
	const candidateId = event.event.data[0].toString()
	await Candidate.remove(candidateId)
	await removeAllDelegations(null, candidateId)
}

