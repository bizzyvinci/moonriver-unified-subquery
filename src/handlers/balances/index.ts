import { SubstrateEvent } from '@subql/types'
import { createTransfer, deposit, withdraw, reserve, unreserve } from './transfer'


const Actions = {
	Deposit: deposit,
	Withdraw: withdraw,
	Reserved: reserve,
	Unreserved: unreserve,
}

export async function createBalances(event: SubstrateEvent) {
	if (event.event.method === 'Transfer') {
		await createTransfer(event)
	} else if (event.event.method in Object.keys(Actions)) {
		const [accountId, value] = event.event.data.toJSON() as [string, string]
		await Actions[event.event.method](accountId, BigInt(value))
	}
}
