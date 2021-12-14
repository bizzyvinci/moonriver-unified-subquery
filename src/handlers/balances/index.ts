import { SubstrateEvent } from '@subql/types'
import { createTransfer } from './transfer'


export async function createBalances(event: SubstrateEvent) {
	if (event.event.method === 'Transfer') {
		await createTransfer(event)
	}
	// Deposit and Withdraw affects balance
	// They need to be handled when working on Balance
}
