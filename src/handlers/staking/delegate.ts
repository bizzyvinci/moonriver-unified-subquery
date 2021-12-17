import { SubstrateEvent } from '@subql/types'
import { Delegator, Delegation } from '../../types'
import { ensureExtrinsic } from '../extrinsic'
import { ensureCandidate } from './candidate'


export async function ensureDelegator(recordId: string) {
	let data = await Delegator.get(recordId)
	if (!data) {
		data = new Delegator(recordId)
		await data.save()
	}
	return data
}

export async function ensureDelegation(delegatorId: string, candidateId: string) {
	const recordId = `${delegatorId}-${candidateId}`
	let data = await Delegation.get(recordId)
	if (!data) {
		data = new Delegation(recordId)
		data.delegatorId = delegatorId
		data.candidateId = candidateId
		await data.save()
	}
	return data
}

export async function createDelegation(event: SubstrateEvent) {
	const [delegatorId, value, candidateId, added] = event.event.data.toJSON() as [string, string, string, any]
	const delegator = await ensureDelegator(delegatorId)
	const candidate = await ensureCandidate(candidateId)
	
	const data = await ensureDelegation(delegator.id, candidate.id)
	data.value = BigInt(value)
	await data.save()
	return data
}

export async function changeDelegation(event: SubstrateEvent) {
	const [delegatorId, candidateId, value, bool] = event.event.data.toJSON() as [string, string, string, Boolean]
	const delegator = await ensureDelegator(delegatorId)
	const candidate = await ensureCandidate(candidateId)
	
	const data = await ensureDelegation(delegator.id, candidate.id)
	data.value = BigInt(value)
	await data.save()
	return data
}

export async function removeDelegation(event: SubstrateEvent) {
	const [delegatorId, candidateId, unstakedAmount, newAmount] = event.event.data.toJSON() as [string, string, string, string]
	const recordId = `${delegatorId}-${candidateId}`
	let data = await Delegation.remove(recordId)
}

export async function removeAllDelegations(delegatorId?: string, candidateId?:string) {
	if (delegatorId) {
		const delegations = await Delegation.getByDelegatorId(delegatorId)
		delegations.map(d => Delegation.remove(d.id).then())
	}
	if (candidateId) {
		const delegations = await Delegation.getByCandidateId(candidateId)
		delegations.map(d => Delegation.remove(d.id).then())
	}
}

