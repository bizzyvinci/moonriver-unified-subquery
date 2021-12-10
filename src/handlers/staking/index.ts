import { SubstrateEvent } from '@subql/types'
import { activateCollator, deactivateCollator } from './collator'
//import { createDelegator } from './delegator'


export async function createStaking(event: SubstrateEvent) {
	if (event.event.section === 'JoinedCollatorCandidates') {
		await activateCollator(event)
	} else if (event.event.section === 'CandidateLeft') {
		await deactivateCollator(event)
	} else if (event.event.section === 'Delegator') {
		return null
	}
}
