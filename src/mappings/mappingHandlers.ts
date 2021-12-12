import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
import { MoonbeamEvent, MoonbeamCall } from '@subql/contract-processors/dist/moonbeam';
import { createEvent, createExtrinsic, createBlock, createLog, createTransaction } from '../handlers';


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    await createBlock(block);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    await createEvent(event)
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    await createExtrinsic(extrinsic)
}

// export async function handleEVMEvent(event: MoonbeamEvent): Promise<void> {
//     await createLog(event)
// }

export async function handleEVMCall(call: MoonbeamCall): Promise<void> {
    await createTransaction(call)
}
