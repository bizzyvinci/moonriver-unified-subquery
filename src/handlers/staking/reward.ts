import { SubstrateEvent } from '@subql/types'
import { Reward } from '../../types'
import { ensureAccount } from '../account'


export async function createReward(event: SubstrateEvent) {
	const [accountId, value] = event.event.data.toJSON() as [string, string]
	const account = await ensureAccount(accountId)
	const blockId = event.block.block.header.number.toString()
	const recordId = `${blockId}-${event.idx}`
	
	const data = Reward.create({
		id: recordId,
		blockNumber: BigInt(blockId),
		accountId: account.id,
		value: BigInt(value),
		timestamp: event.block.timestamp
	})

	await data.save()
	return data
}
