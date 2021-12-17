import { SubstrateEvent } from '@subql/types'
import { Reward } from '../../types'
import { ensureExtrinsic } from '../extrinsic'
import { ensureAccount } from '../account'


export async function createReward(event: SubstrateEvent) {
	const [accountId, value] = event.event.data.toJSON() as [string, string]
	const account = await ensureAccount(accountId)
	const recordId = `${event.block.block.header.number.toString()}-${event.idx}`
	
	const data = Reward.create({
		id: recordId,
		accountId: account.id,
		value: BigInt(value),
		timestamp: event.block.timestamp
	})

	await data.save()
	return data
}
