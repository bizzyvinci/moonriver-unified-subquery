import { SubstrateEvent } from '@subql/types'
import { createCandidate, chooseCandidate, changeSelfBonded, removeCandidate } from './candidate';
import { createDelegation, changeDelegation, removeDelegation, removeAllDelegations } from './delegate';
import { createReward } from './reward';


// Lingo really change between spec versions
// e.g Collator to Candidate and Nomination to Delegation
const eventAction = {
	Rewarded: createReward,
	JoinedCollatorCandidates: createCandidate,
	CollatorChosen: chooseCandidate,
	CandidateBondedMore: changeSelfBonded,
	CollatorBondedMore: changeSelfBonded,
	CandidateBondedLess: changeSelfBonded,
	CollatorBondedLess: changeSelfBonded,
	CandidateLeft: removeCandidate,
	CollatorLeft: removeCandidate,
	Delegation: createDelegation,
	Nomination: createDelegation,
	DelegationIncreased: changeDelegation,
	NominationIncreased: changeDelegation,
	DelegationDecreased: changeDelegation,
	NominationDecreased: changeDelegation,
	DelegatorLeftCandidate: removeDelegation,
	NominatorLeftCollator: removeDelegation,
}

export async function createStaking(event: SubstrateEvent) {
	if (event.event.method in eventAction) {
		await eventAction[event.event.method](event)
	} else if (event.event.method in ['DelegatorLeft', 'NominatorLeft']) {
		await removeAllDelegations(event.event.data[0].toString(), null);
	}
}
