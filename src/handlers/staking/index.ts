import { SubstrateEvent } from '@subql/types'
import { activateCollator, deactivateCollator } from './collator'
//import { createDelegator } from './delegator'


export async function createStaking(event: SubstrateEvent) {
	if (event.event.method === 'JoinedCollatorCandidates') {
		await activateCollator(event)
	} else if (event.event.method === 'CandidateLeft') {
		await deactivateCollator(event)
	} else if (event.event.method === 'Delegator') {
		return null
	}
}
