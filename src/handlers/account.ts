import { Account } from '../types';


export async function ensureAccount(account: string) {
  let data = await Account.get(account.toLowerCase())
  if (!data) {
    data = new Account(account.toLowerCase())
    data.freeBalance = BigInt(0)
    data.reservedBalance = BigInt(0)
    data.totalBalance = BigInt(0)
    await data.save()
  }
  return data
}

export async function getAccount(account: string) {
  const data = await Account.get(account)
  return data
}
