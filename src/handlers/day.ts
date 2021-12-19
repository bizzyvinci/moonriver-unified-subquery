import { Day } from '../types'


export async function ensureDay(date: Date) {
	const recordId = date.toISOString().slice(0, 10)
	let data = await Day.get(recordId)
	if (!data) {
		data = Day.create({
			id: recordId,
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate(),
			extrinsics: BigInt(0),
			transactions: BigInt(0),
			events: BigInt(0),
			transferCounts: BigInt(0),
			transferAmount: BigInt(0),
			erc20TransferCounts: BigInt(0),
			erc721TransferCounts: BigInt(0),
		})
		await data.save()
	}

	return data
}
