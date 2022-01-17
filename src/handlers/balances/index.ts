import { SubstrateEvent } from '@subql/types'
import { createTransfer, deposit, withdraw, reserve, unreserve } from './transfer'


const Action = {
  Deposit: deposit,
  Withdraw: withdraw,
  Reserved: reserve,
  Unreserved: unreserve,
}

export async function createBalances(event: SubstrateEvent) {
  if (event.event.method === 'Transfer') {
    await createTransfer(event)
  } else if (Object.prototype.hasOwnProperty.call(Action, event.event.method)) {
    const [accountId, value] = event.event.data.toJSON() as [string, string]
    await Action[event.event.method](accountId, BigInt(value))
  }
}
