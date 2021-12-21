import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam'
import { ensureAccount } from '../account'
import { Erc721Token, Erc721Balance, Erc721Transfer, Log } from '../../types'


const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export async function createErc721Transfer(event: MoonbeamEvent, log: Log) {
	// create Transfer, Edit Balance, 
	const token = await ensureToken(event.address)
	const from = await ensureAccount(`0x${event.topics[1].slice(-40)}`)
	const to = await ensureAccount(`0x${event.topics[2].slice(-40)}`)
	const value = BigInt(event.topics[3])

	const transfer = Erc721Transfer.create({
		id: log.id,
		fromId: from.id,
		toId: to.id,
		tokenId: token.id,
		value: value,
		transactionHash: log.transactionId,
		transactionIndex: log.transactionIndex,
		blockNumber: BigInt(log.blockId),
		timestamp: log.timestamp
	})

	await transfer.save()

	// Set Balance
	await setBalance(token.id, to.id, value)
}


async function ensureToken(address: string) {
	let data = await Erc721Token.get(address)
	if (!data) {
		data = Erc721Token.create({
			id: address
		})
		await data.save()
	}
	return data
}


async function setBalance(tokenId: string, accountId: string, value: bigint) {
	const recordId = `${tokenId}-${value}`
	if (accountId===NULL_ADDRESS) {
		await Erc721Balance.remove(recordId)
		return
	} else {
		const data = Erc721Balance.create({
			id: recordId,
			tokenId: tokenId,
			accountId: accountId,
			value: value
		})
		await data.save()
		return data
	}
}
