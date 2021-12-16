import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam'
import { ensureAccount } from '../account'
import { ERC721Token, ERC721Balance, ERC721Transfer} from '../../types'


const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export async function createERC721Transfer(event: MoonbeamEvent, recordId: string) {
	// create Transfer, Edit Balance, 
	const token = await ensureToken(event.address)
	const from = await ensureAccount(`0x${event.topics[1].slice(-40)}`)
	const to = await ensureAccount(`0x${event.topics[2].slice(-40)}`)
	const value = BigInt(event.topics[3])

	const transfer = ERC721Transfer.create({
		id: recordId,
		fromId: from.id,
		toId: to.id,
		tokenId: token.id,
		value: value,
		logId: recordId,
	})

	await transfer.save()

	// Minting and Burning
	if (from.id === NULL_ADDRESS) {
		token.supply.push(value)
	} else if (to.id === NULL_ADDRESS) {
		const idx = token.supply.indexOf(value)
		if (idx>-1) {
			token.supply.splice(idx, 1)
		}
	}
	await token.save()

	// Set Balance
	await setBalance(token.id, to.id, value)
}


async function ensureToken(address: string) {
	let data = await ERC721Token.get(address)
	if (!data) {
		data = ERC721Token.create({
			id: address,
			supply: []
		})
		await data.save()
	}
	return data
}


async function setBalance(tokenId: string, accountId: string, value: bigint) {
	const recordId = `${tokenId}-${value}`
	if (accountId===NULL_ADDRESS) {
		await ERC721Balance.remove(recordId)
		return
	} else {
		const data = ERC721Balance.create({
			id: recordId,
			tokenId: tokenId,
			accountId: accountId,
			value: value
		})
		await data.save()
		return data
	}
}
