import { SubstrateEvent } from '@subql/types'
import { Transfer } from '../../types'
import { ensureExtrinsic } from '../extrinsic'
import { ensureAccount } from '../account'


export async function createTransfer(event: SubstrateEvent) {
	const [fromId, toId, value] = event.event.data.toJSON() as [string, string, string]
	
	const from = await ensureAccount(fromId)
	const to = await ensureAccount(toId)
	const extrinsic = await ensureExtrinsic(event.extrinsic)

	await deposit(to.id, BigInt(value))
	await withdraw(from.id, BigInt(value))
	
	const blockId = event.block.block.header.number.toString()
	const idx = event.idx
	const recordId = `${blockId}-${idx}`

	const data = Transfer.create({
		id: recordId,
		index: idx,
		blockId: blockId,
		extrinsicId: extrinsic.id,
		fromId: from.id,
		toId: to.id,
		value: BigInt(value)
	})
	await data.save()
	return data
}

export async function deposit(accountId: string, value: bigint) {
	const account = await ensureAccount(accountId)
	account.freeBalance = (account.freeBalance || BigInt(0)) + value
	await account.save()
}

export async function withdraw(accountId: string, value: bigint) {
	const account = await ensureAccount(accountId)
	account.freeBalance = (account.freeBalance || BigInt(0)) - value
	await account.save()
}

export async function reserve(accountId: string, value: bigint) {
	const account = await ensureAccount(accountId)
	account.freeBalance = (account.freeBalance || BigInt(0)) - value
	account.reservedBalance = (account.reservedBalance || BigInt(0)) + value
	await account.save()
}

export async function unreserve(accountId: string, value: bigint) {
	const account = await ensureAccount(accountId)
	account.freeBalance = (account.freeBalance || BigInt(0)) + value
	account.reservedBalance = (account.reservedBalance || BigInt(0)) - value
	await account.save()
}

