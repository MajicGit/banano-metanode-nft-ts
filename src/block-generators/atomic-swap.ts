import * as bananojs from '@bananocoin/bananojs';

import { ATOMIC_SWAP_HEADER } from "../constants";
import { findBlockAtHeight } from '../lib/find-block-at-height';
import { toFixedLengthPositiveHex } from "../lib/to-fixed-length-positive-hex";

// https://github.com/Airtune/73-meta-tokens/blob/main/meta_ledger_protocol/atomic_swap.md
export const generateSendAtomicSwapRepresentative = (assetHeight: bigint, receiveHeight: bigint, minRaw: bigint) => {
  const assetHeightHex   = toFixedLengthPositiveHex(assetHeight, 10);
  const receiveHeightHex = toFixedLengthPositiveHex(receiveHeight, 10);
  const minRawHex        = toFixedLengthPositiveHex(minRaw, 31);

  const atomicSwapRepresentativeHex = `${ATOMIC_SWAP_HEADER}${assetHeightHex}${receiveHeightHex}${minRawHex}`;
  const atomicSwapRepresentative = bananojs.getBananoAccount(atomicSwapRepresentativeHex);

  return atomicSwapRepresentative;
}

export const generateSendAtomicSwapBlock = async (sender: string, previous: string, recipient: string, assetHeight: bigint, receiveHeight: bigint, minRaw: bigint) => {
  const atomicSwapRepresentative = generateSendAtomicSwapRepresentative(assetHeight, receiveHeight, minRaw);
  const recipientPublicKey = bananojs.getAccountPublicKey(recipient);

  return {
    "type": "state",
    "account": sender,
    "previous": previous,
    "representative": atomicSwapRepresentative,
    "link": recipientPublicKey
  }
}

export const generateReceiveAtomicSwapBlock = async (account: string, sendAtomicSwapBlockHash, receiveHeight: bigint) => {
  const previousHeight: bigint = receiveHeight - BigInt("1");
  const previousBlock = await findBlockAtHeight(account, previousHeight);
  return {
    "type": "state",
    "account": account,
    "previous": previousBlock.hash,
    "representative": previousBlock.representative, // changing representative here cancels the atomic swap
    "link": sendAtomicSwapBlockHash
  }
}

export const generateAbortReceiveAtomicSwapBlock = async() => {

}

export const generateAbortPaymentBlock = async() => {
  
}