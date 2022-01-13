import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam'
import { ensureAccount } from '../account'

export async function linkContract(event: MoonbeamEvent) {
  const account = await ensureAccount(event.address.toString())
  const creator = await ensureAccount(`0x${event.topics[2].slice(-40)}`)

  account.isContract = true
  account.creatorId = creator.id
  account.createdAt = event.transactionHash

  await account.save()
  return account
}
