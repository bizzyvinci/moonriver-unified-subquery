import { SubstrateExtrinsic } from '@subql/types'
import { Extrinsic } from '../types'
import { ensureAccount } from './account'
import { ensureBlock } from './block'


export async function ensureExtrinsic(extrinsic: SubstrateExtrinsic): Promise<Extrinsic> {
	// Hash?! For real?!
	const recordId = extrinsic.extrinsic.hash.toString()
	let data = await Extrinsic.get(recordId)
	if (!data) {
		data = new Extrinsic(recordId)
		await data.save()
	}
	return data
}

export async function createExtrinsic(extrinsic: SubstrateExtrinsic) {
	const data = await ensureExtrinsic(extrinsic)
	
	const isSigned = extrinsic.extrinsic.isSigned
	const block = await ensureBlock(extrinsic.block.block.header.number.toString())
	if (isSigned) {
		const signerAccount = extrinsic.extrinsic.signer.toString()
		const signer = await ensureAccount(signerAccount)
		data.signerId = signer.id
	}
	
	data.isSigned = isSigned
	data.blockId = block.id
	data.method = extrinsic.extrinsic.method.method
	data.section = extrinsic.extrinsic.method.section
	data.index = extrinsic.idx
	data.success = extrinsic.success
	// lazy method
	data.arguments = extrinsic.extrinsic.args.toString()

	await data.save()
	return data
}
